package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.PolicyPurchaseRequest;
import com.smartinsurance.claims.dto.PolicyResponse;
import com.smartinsurance.claims.service.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @PostMapping
    public PolicyResponse purchasePolicy(
            Authentication authentication,
            @Valid @RequestBody PolicyPurchaseRequest request) {

        return policyService.purchasePolicy(
                authentication.getName(),
                request
        );
    }

    @GetMapping("/my")
    public List<PolicyResponse> getMyPolicies(
            Authentication authentication) {

        return policyService.getMyPolicies(
                authentication.getName()
        );
    }

    @GetMapping("/my/{policyNumber}")
    public PolicyResponse getMyPolicy(
            Authentication authentication,
            @PathVariable String policyNumber) {

        return policyService.getMyPolicy(
                authentication.getName(),
                policyNumber
        );
    }

    @PostMapping("/my/{policyNumber}/renew")
    public PolicyResponse renewPolicy(
            Authentication authentication,
            @PathVariable String policyNumber) {

        return policyService.renewPolicy(
                authentication.getName(),
                policyNumber
        );
    }

    @PostMapping("/my/{policyNumber}/cancel")
    public PolicyResponse requestCancellation(
            Authentication authentication,
            @PathVariable String policyNumber) {

        return policyService.requestCancellation(
                authentication.getName(),
                policyNumber
        );
    }
}