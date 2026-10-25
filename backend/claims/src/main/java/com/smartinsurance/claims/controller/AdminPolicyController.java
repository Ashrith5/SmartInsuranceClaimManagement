package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.PolicyResponse;
import com.smartinsurance.claims.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/policies")
@RequiredArgsConstructor
public class AdminPolicyController {

    private final PolicyService policyService;

    @PostMapping("/{policyNumber}/approve-cancellation")
    public PolicyResponse approveCancellation(
            @PathVariable String policyNumber) {

        return policyService.approveCancellation(
                policyNumber
        );
    }
}