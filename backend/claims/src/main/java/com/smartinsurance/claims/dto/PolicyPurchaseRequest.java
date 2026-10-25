package com.smartinsurance.claims.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyPurchaseRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Nominee name is required")
    private String nomineeName;

    @NotBlank(message = "Nominee relationship is required")
    private String nomineeRelationship;
}