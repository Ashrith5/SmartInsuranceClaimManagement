package com.smartinsurance.claims.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClaimInfoResponse {

    @NotBlank(message = "Response is required")
    @Size(
            max = 1000,
            message = "Response cannot exceed 1000 characters"
    )
    private String message;
}