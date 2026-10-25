package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.ClaimDecisionRequest;
import com.smartinsurance.claims.dto.ClaimHistoryResponse;
import com.smartinsurance.claims.dto.ClaimInfoRequest;
import com.smartinsurance.claims.dto.ClaimInformationResponse;
import com.smartinsurance.claims.dto.ClaimResponse;
import com.smartinsurance.claims.service.ClaimWorkflowService;
import com.smartinsurance.claims.service.ClaimsOfficerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/officer/claims")
@RequiredArgsConstructor
public class ClaimsOfficerController {

    private final ClaimsOfficerService claimsOfficerService;
    private final ClaimWorkflowService claimWorkflowService;

    @GetMapping("/queue")
    public List<ClaimResponse> getSubmittedClaims() {

        return claimsOfficerService.getSubmittedClaims();
    }

    @GetMapping("/{claimNumber}")
    public ClaimResponse getClaim(
            @PathVariable String claimNumber) {

        return claimsOfficerService.getClaim(claimNumber);
    }

    @PostMapping("/{claimNumber}/start-review")
    public ClaimResponse startReview(
            Authentication authentication,
            @PathVariable String claimNumber) {

        return claimsOfficerService.startReview(
                authentication.getName(),
                claimNumber
        );
    }

    @PostMapping("/{claimNumber}/request-information")
    public ClaimInformationResponse requestInformation(
            Authentication authentication,
            @PathVariable String claimNumber,
            @Valid @RequestBody ClaimInfoRequest request) {

        return claimWorkflowService.requestInformation(
                authentication.getName(),
                claimNumber,
                request
        );
    }

    @GetMapping("/{claimNumber}/history")
    public List<ClaimHistoryResponse> getClaimHistory(
            @PathVariable String claimNumber) {

        return claimWorkflowService.getOfficerClaimHistory(
                claimNumber
        );
    }

    @PostMapping("/{claimNumber}/approve")
    public ClaimResponse approveClaim(
            Authentication authentication,
            @PathVariable String claimNumber,
            @Valid @RequestBody ClaimDecisionRequest request) {

        return claimsOfficerService.approveClaim(
                authentication.getName(),
                claimNumber,
                request
        );
    }

    @PostMapping("/{claimNumber}/reject")
    public ClaimResponse rejectClaim(
            Authentication authentication,
            @PathVariable String claimNumber,
            @Valid @RequestBody ClaimDecisionRequest request) {

        return claimsOfficerService.rejectClaim(
                authentication.getName(),
                claimNumber,
                request
        );
    }
}