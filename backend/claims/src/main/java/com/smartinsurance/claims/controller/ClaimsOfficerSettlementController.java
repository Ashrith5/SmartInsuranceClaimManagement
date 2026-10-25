package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.ClaimSettlementRequest;
import com.smartinsurance.claims.dto.ClaimSettlementResponse;
import com.smartinsurance.claims.service.ClaimSettlementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/officer/claims")
@RequiredArgsConstructor
public class ClaimsOfficerSettlementController {

    private final ClaimSettlementService claimSettlementService;

    @PostMapping("/{claimNumber}/settlement")
    public ClaimSettlementResponse settleClaim(
            Authentication authentication,
            @PathVariable String claimNumber,
            @Valid @RequestBody
            ClaimSettlementRequest request) {

        return claimSettlementService.settleClaim(
                authentication.getName(),
                claimNumber,
                request
        );
    }

    @GetMapping("/{claimNumber}/settlement")
    public ClaimSettlementResponse getSettlement(
            @PathVariable String claimNumber) {

        return claimSettlementService
                .getOfficerSettlement(claimNumber);
    }
}