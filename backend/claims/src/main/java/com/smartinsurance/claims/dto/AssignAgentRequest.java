package com.smartinsurance.claims.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignAgentRequest {

    @NotNull(message = "Agent ID is required")
    private Long agentId;

    @NotNull(message = "Customer ID is required")
    private Long customerId;
}
