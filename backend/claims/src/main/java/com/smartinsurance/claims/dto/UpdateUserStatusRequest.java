package com.smartinsurance.claims.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserStatusRequest {

    @NotNull(message = "Enabled status is required")
    private Boolean enabled;
}