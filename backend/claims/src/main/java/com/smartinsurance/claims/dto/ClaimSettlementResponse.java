package com.smartinsurance.claims.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ClaimSettlementResponse {

    private Long id;

    private String settlementNumber;

    private String claimNumber;

    private BigDecimal claimAmount;

    private BigDecimal settlementAmount;

    private String paymentReference;

    private String settlementStatus;

    private LocalDateTime settledAt;
}