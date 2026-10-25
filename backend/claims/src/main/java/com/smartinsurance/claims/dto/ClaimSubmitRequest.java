package com.smartinsurance.claims.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class ClaimSubmitRequest {

    @NotBlank(message = "Policy number is required")
    private String policyNumber;

    @NotBlank(message = "Claim type is required")
    private String claimType;

    @NotNull(message = "Incident date is required")
    @PastOrPresent(message = "Incident date cannot be in the future")
    private LocalDate incidentDate;

    @NotNull(message = "Claim amount is required")
    @DecimalMin(
            value = "0.01",
            message = "Claim amount must be greater than zero"
    )
    private BigDecimal claimAmount;

    @NotBlank(message = "Description is required")
    @Size(
            max = 1000,
            message = "Description cannot exceed 1000 characters"
    )
    private String description;
}