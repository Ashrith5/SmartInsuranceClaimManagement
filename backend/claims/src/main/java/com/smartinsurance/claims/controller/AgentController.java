package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.AgentCustomerResponse;
import com.smartinsurance.claims.dto.ClaimResponse;
import com.smartinsurance.claims.dto.PolicyResponse;
import com.smartinsurance.claims.service.AgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/agent")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;

    @GetMapping("/customers")
    public List<AgentCustomerResponse> getCustomers(
            Authentication authentication) {

        return agentService.getAssignedCustomers(
                authentication.getName()
        );
    }

    @GetMapping("/customers/{customerId}/policies")
    public List<PolicyResponse> getCustomerPolicies(
            Authentication authentication,
            @PathVariable Long customerId) {

        return agentService.getCustomerPolicies(
                authentication.getName(),
                customerId
        );
    }

    @GetMapping("/customers/{customerId}/claims")
    public List<ClaimResponse> getCustomerClaims(
            Authentication authentication,
            @PathVariable Long customerId) {

        return agentService.getCustomerClaims(
                authentication.getName(),
                customerId
        );
    }
}