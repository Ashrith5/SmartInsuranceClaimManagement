package com.smartinsurance.claims.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String productName;

    @NotBlank(message = "Product category is required")
    private String productCategory;

    @NotNull(message = "Coverage amount is required")
    @DecimalMin(
            value = "0.01",
            message = "Coverage amount must be greater than zero"
    )
    private BigDecimal coverageAmount;

    @NotNull(message = "Premium amount is required")
    @DecimalMin(
            value = "0.01",
            message = "Premium amount must be greater than zero"
    )
    private BigDecimal premiumAmount;

    @NotNull(message = "Policy tenure is required")
    @Min(
            value = 1,
            message = "Policy tenure must be at least 1 month"
    )
    private Integer policyTenureMonths;
}