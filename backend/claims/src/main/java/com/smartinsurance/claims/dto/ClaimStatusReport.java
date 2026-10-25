package com.smartinsurance.claims.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ClaimStatusReport {

    private String status;
    private Long claimCount;
    private BigDecimal totalClaimAmount;
    private BigDecimal averageClaimAmount;
}