package com.smartinsurance.claims.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClaimInfoRequest {

    @NotBlank(message = "Information request is required")
    @Size(
            max = 1000,
            message = "Information request cannot exceed 1000 characters"
    )
    private String message;
}