package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.ClaimSettlementResponse;
import com.smartinsurance.claims.service.ClaimSettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/claims")
@RequiredArgsConstructor
public class ClaimSettlementController {

    private final ClaimSettlementService claimSettlementService;

    @GetMapping("/my/{claimNumber}/settlement")
    public ClaimSettlementResponse getSettlement(
            Authentication authentication,
            @PathVariable String claimNumber) {

        return claimSettlementService.getCustomerSettlement(
                authentication.getName(),
                claimNumber
        );
    }
}