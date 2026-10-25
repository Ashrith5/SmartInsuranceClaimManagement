package com.smartinsurance.claims.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClaimDecisionRequest {

    @NotBlank(message = "Decision reason is required")
    @Size(
            max = 1000,
            message = "Decision reason cannot exceed 1000 characters"
    )
    private String reason;
}