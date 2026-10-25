package com.smartinsurance.claims.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String productName;
    private String productCategory;
    private BigDecimal coverageAmount;
    private BigDecimal premiumAmount;
    private Integer policyTenureMonths;
}