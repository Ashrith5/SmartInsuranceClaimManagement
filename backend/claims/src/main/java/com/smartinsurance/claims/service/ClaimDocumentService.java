package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.ClaimDocumentDownload;
import com.smartinsurance.claims.dto.ClaimDocumentResponse;
import com.smartinsurance.claims.entity.Claim;
import com.smartinsurance.claims.entity.ClaimDocument;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.ClaimDocumentRepository;
import com.smartinsurance.claims.repository.ClaimRepository;
import com.smartinsurance.claims.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClaimDocumentService {

    private static final long MAX_FILE_SIZE =
            10L * 1024L * 1024L;

    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of(
                    "application/pdf",
                    "image/jpeg",
                    "image/png"
            );

    private static final Set<String> ALLOWED_DOCUMENT_TYPES =
            Set.of(
                    "POLICE_REPORT",
                    "MEDICAL_REPORT",
                    "DAMAGE_PHOTO",
                    "INVOICE",
                    "OTHER"
            );

    private final ClaimDocumentRepository documentRepository;
    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.claims-directory}")
    private String claimsUploadDirectory;

    @Transactional
    public ClaimDocumentResponse uploadDocument(
            String customerEmail,
            String claimNumber,
            String documentType,
            MultipartFile file) {

        User customer = findUser(customerEmail);
        Claim claim = findClaim(claimNumber);

        validateOwnership(claim, customer);
        validateFile(file);

        String normalizedDocumentType =
                documentType.trim().toUpperCase();

        if (!ALLOWED_DOCUMENT_TYPES.contains(
                normalizedDocumentType)) {

            throw new IllegalArgumentException(
                    "Invalid document type. Allowed types are " +
                    "POLICE_REPORT, MEDICAL_REPORT, DAMAGE_PHOTO, INVOICE, OTHER");
        }

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null
                || originalFileName.isBlank()) {

            throw new IllegalArgumentException(
                    "File name is required");
        }

        originalFileName =
                Paths.get(originalFileName)
                        .getFileName()
                        .toString();

        String extension =
                getExtension(originalFileName);

        String storedFileName =
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        + extension;

        Path uploadDirectory =
                Paths.get(claimsUploadDirectory)
                        .toAbsolutePath()
                        .normalize();

        Path targetPath =
                uploadDirectory
                        .resolve(storedFileName)
                        .normalize();

        if (!targetPath.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException(
                    "Invalid file path");
        }

        try {
            Files.createDirectories(uploadDirectory);

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

        } catch (IOException ex) {
            throw new IllegalStateException(
                    "Unable to store claim document");
        }

        ClaimDocument document =
                new ClaimDocument();

        document.setClaim(claim);
        document.setUploadedBy(customer);
        document.setOriginalFileName(originalFileName);
        document.setStoredFileName(storedFileName);
        document.setFilePath(targetPath.toString());
        document.setContentType(file.getContentType());
        document.setFileSize(file.getSize());
        document.setDocumentType(normalizedDocumentType);

        ClaimDocument savedDocument;

        try {
            savedDocument =
                    documentRepository.save(document);

        } catch (RuntimeException ex) {

            try {
                Files.deleteIfExists(targetPath);
            } catch (IOException ignored) {
                // Database exception remains the primary failure.
            }

            throw ex;
        }

        return toResponse(savedDocument);
    }

    @Transactional(readOnly = true)
    public List<ClaimDocumentResponse> getCustomerDocuments(
            String customerEmail,
            String claimNumber) {

        User customer = findUser(customerEmail);
        Claim claim = findClaim(claimNumber);

        validateOwnership(claim, customer);

        return documentRepository
                .findByClaimIdOrderByUploadedAtDesc(
                        claim.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClaimDocumentResponse> getOfficerDocuments(
            String claimNumber) {

        Claim claim = findClaim(claimNumber);

        return documentRepository
                .findByClaimIdOrderByUploadedAtDesc(
                        claim.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClaimDocumentDownload downloadCustomerDocument(
            String customerEmail,
            String claimNumber,
            Long documentId) {

        User customer = findUser(customerEmail);
        Claim claim = findClaim(claimNumber);

        validateOwnership(claim, customer);

        ClaimDocument document =
                findDocument(documentId, claim.getId());

        return createDownload(document);
    }

    @Transactional(readOnly = true)
    public ClaimDocumentDownload downloadOfficerDocument(
            String claimNumber,
            Long documentId) {

        Claim claim = findClaim(claimNumber);

        ClaimDocument document =
                findDocument(documentId, claim.getId());

        return createDownload(document);
    }

    private ClaimDocument findDocument(
            Long documentId,
            Long claimId) {

        return documentRepository
                .findByIdAndClaimId(documentId, claimId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Claim document not found"));
    }

    private ClaimDocumentDownload createDownload(
            ClaimDocument document) {

        try {
            Path uploadDirectory =
                    Paths.get(claimsUploadDirectory)
                            .toAbsolutePath()
                            .normalize();

            Path filePath =
                    Paths.get(document.getFilePath())
                            .toAbsolutePath()
                            .normalize();

            if (!filePath.startsWith(uploadDirectory)) {
                throw new IllegalArgumentException(
                        "Invalid stored document path");
            }

            Resource resource =
                    new UrlResource(filePath.toUri());

            if (!resource.exists()
                    || !resource.isReadable()) {

                throw new IllegalArgumentException(
                        "Stored claim document is unavailable");
            }

            return new ClaimDocumentDownload(
                    resource,
                    document.getOriginalFileName(),
                    document.getContentType(),
                    document.getFileSize()
            );

        } catch (MalformedURLException ex) {
            throw new IllegalStateException(
                    "Unable to load claim document");
        }
    }

    private void validateFile(
            MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Document file is required");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "Document size cannot exceed 10 MB");
        }

        String contentType =
                file.getContentType();

        if (contentType == null
                || !ALLOWED_CONTENT_TYPES.contains(
                        contentType.toLowerCase())) {

            throw new IllegalArgumentException(
                    "Only PDF, JPEG and PNG documents are allowed");
        }
    }

    private String getExtension(
            String fileName) {

        int index =
                fileName.lastIndexOf('.');

        if (index < 0) {
            return "";
        }

        return fileName
                .substring(index)
                .toLowerCase();
    }

    private Claim findClaim(
            String claimNumber) {

        return claimRepository
                .findByClaimNumber(claimNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Claim not found"));
    }

    private User findUser(
            String email) {

        return userRepository
                .findByEmail(email.toLowerCase())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Customer not found"));
    }

    private void validateOwnership(
            Claim claim,
            User customer) {

        if (!claim.getUser()
                .getId()
                .equals(customer.getId())) {

            throw new IllegalArgumentException(
                    "Claim does not belong to this customer");
        }
    }

    private ClaimDocumentResponse toResponse(
            ClaimDocument document) {

        return new ClaimDocumentResponse(
                document.getId(),
                document.getClaim().getClaimNumber(),
                document.getOriginalFileName(),
                document.getContentType(),
                document.getFileSize(),
                document.getDocumentType(),
                document.getUploadedAt()
        );
    }
}