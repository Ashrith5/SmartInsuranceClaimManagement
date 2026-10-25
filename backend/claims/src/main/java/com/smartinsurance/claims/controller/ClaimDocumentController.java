package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.ClaimDocumentDownload;
import com.smartinsurance.claims.dto.ClaimDocumentResponse;
import com.smartinsurance.claims.service.ClaimDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/v1/claims")
@RequiredArgsConstructor
public class ClaimDocumentController {

    private final ClaimDocumentService claimDocumentService;

    @PostMapping(
            value = "/my/{claimNumber}/documents",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ClaimDocumentResponse uploadDocument(
            Authentication authentication,
            @PathVariable String claimNumber,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) {

        return claimDocumentService.uploadDocument(
                authentication.getName(),
                claimNumber,
                documentType,
                file
        );
    }

    @GetMapping("/my/{claimNumber}/documents")
    public List<ClaimDocumentResponse> getDocuments(
            Authentication authentication,
            @PathVariable String claimNumber) {

        return claimDocumentService.getCustomerDocuments(
                authentication.getName(),
                claimNumber
        );
    }

    @GetMapping("/my/{claimNumber}/documents/{documentId}/download")
    public ResponseEntity<?> downloadDocument(
            Authentication authentication,
            @PathVariable String claimNumber,
            @PathVariable Long documentId) {

        ClaimDocumentDownload download =
                claimDocumentService.downloadCustomerDocument(
                        authentication.getName(),
                        claimNumber,
                        documentId
                );

        return buildDownloadResponse(download);
    }

    private ResponseEntity<?> buildDownloadResponse(
            ClaimDocumentDownload download) {

        ContentDisposition disposition =
                ContentDisposition.attachment()
                        .filename(
                                download.originalFileName(),
                                StandardCharsets.UTF_8
                        )
                        .build();

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                download.contentType()
                        )
                )
                .contentLength(download.fileSize())
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        disposition.toString()
                )
                .body(download.resource());
    }
}