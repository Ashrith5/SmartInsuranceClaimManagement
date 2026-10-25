package com.smartinsurance.claims.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {

    @NotBlank(message = "Policy number is required")
    private String policyNumber;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}