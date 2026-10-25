package com.smartinsurance.claims.dto;

import org.springframework.core.io.Resource;

public record ClaimDocumentDownload(
        Resource resource,
        String originalFileName,
        String contentType,
        Long fileSize
) {
}