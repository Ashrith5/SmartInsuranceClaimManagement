package com.smartinsurance.claims.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class PolicyResponse {

    private Long id;
    private String policyNumber;

    private Long productId;
    private String productName;
    private String productCategory;

    private String nomineeName;
    private String nomineeRelationship;

    private LocalDate startDate;
    private LocalDate endDate;

    private BigDecimal premiumAmount;

    private String status;
    private Boolean cancellationRequested;
}