package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.ClaimDocumentDownload;
import com.smartinsurance.claims.dto.ClaimDocumentResponse;
import com.smartinsurance.claims.service.ClaimDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/v1/officer/claims")
@RequiredArgsConstructor
public class ClaimsOfficerDocumentController {

    private final ClaimDocumentService claimDocumentService;

    @GetMapping("/{claimNumber}/documents")
    public List<ClaimDocumentResponse> getDocuments(
            @PathVariable String claimNumber) {

        return claimDocumentService.getOfficerDocuments(
                claimNumber
        );
    }

    @GetMapping("/{claimNumber}/documents/{documentId}/download")
    public ResponseEntity<?> downloadDocument(
            @PathVariable String claimNumber,
            @PathVariable Long documentId) {

        ClaimDocumentDownload download =
                claimDocumentService.downloadOfficerDocument(
                        claimNumber,
                        documentId
                );

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