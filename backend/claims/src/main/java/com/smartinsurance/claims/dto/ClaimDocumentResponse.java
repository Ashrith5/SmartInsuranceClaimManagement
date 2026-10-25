package com.smartinsurance.claims.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ClaimDocumentResponse {

    private Long id;

    private String claimNumber;

    private String originalFileName;

    private String contentType;

    private Long fileSize;

    private String documentType;

    private LocalDateTime uploadedAt;
}