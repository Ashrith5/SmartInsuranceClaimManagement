package com.smartinsurance.claims.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ClaimResponse {

    private Long id;
    private String claimNumber;

    private String policyNumber;

    private String productName;
    private String productCategory;

    private String claimType;
    private LocalDate incidentDate;
    private BigDecimal claimAmount;

    private String description;

    private String status;

    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;

    private String decisionReason;
}