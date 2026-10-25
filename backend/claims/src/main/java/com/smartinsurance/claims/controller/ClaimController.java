package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.ClaimHistoryResponse;
import com.smartinsurance.claims.dto.ClaimInfoResponse;
import com.smartinsurance.claims.dto.ClaimInformationResponse;
import com.smartinsurance.claims.dto.ClaimResponse;
import com.smartinsurance.claims.dto.ClaimSubmitRequest;
import com.smartinsurance.claims.service.ClaimService;
import com.smartinsurance.claims.service.ClaimWorkflowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;
    private final ClaimWorkflowService claimWorkflowService;

    @PostMapping
    public ClaimResponse submitClaim(
            Authentication authentication,
            @Valid @RequestBody ClaimSubmitRequest request) {

        return claimService.submitClaim(
                authentication.getName(),
                request
        );
    }

    @GetMapping("/my")
    public List<ClaimResponse> getMyClaims(
            Authentication authentication) {

        return claimService.getMyClaims(
                authentication.getName()
        );
    }

    @GetMapping("/my/{claimNumber}")
    public ClaimResponse getMyClaim(
            Authentication authentication,
            @PathVariable String claimNumber) {

        return claimService.getMyClaim(
                authentication.getName(),
                claimNumber
        );
    }

    @PostMapping("/my/{claimNumber}/information-response")
    public ClaimInformationResponse respondToInformation(
            Authentication authentication,
            @PathVariable String claimNumber,
            @Valid @RequestBody ClaimInfoResponse response) {

        return claimWorkflowService.respondToInformation(
                authentication.getName(),
                claimNumber,
                response
        );
    }

    @GetMapping("/my/{claimNumber}/information-requests")
    public List<ClaimInformationResponse> getInformationRequests(
            Authentication authentication,
            @PathVariable String claimNumber) {

        return claimWorkflowService.getInformationRequests(
                authentication.getName(),
                claimNumber
        );
    }

    @GetMapping("/my/{claimNumber}/history")
    public List<ClaimHistoryResponse> getClaimHistory(
            Authentication authentication,
            @PathVariable String claimNumber) {

        return claimWorkflowService.getCustomerClaimHistory(
                authentication.getName(),
                claimNumber
        );
    }
}