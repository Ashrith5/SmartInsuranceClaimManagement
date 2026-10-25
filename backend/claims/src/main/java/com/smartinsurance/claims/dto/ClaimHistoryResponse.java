package com.smartinsurance.claims.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ClaimHistoryResponse {

    private Long id;

    private String claimNumber;

    private String previousStatus;

    private String newStatus;

    private String changedByEmail;

    private String action;

    private String remarks;

    private LocalDateTime changedAt;
}