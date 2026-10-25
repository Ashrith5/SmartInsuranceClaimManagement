package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.PaymentRequest;
import com.smartinsurance.claims.dto.PaymentResponse;
import com.smartinsurance.claims.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public PaymentResponse makePayment(
            Authentication authentication,
            @Valid @RequestBody PaymentRequest request) {

        return paymentService.makePayment(
                authentication.getName(),
                request
        );
    }

    @GetMapping("/my")
    public List<PaymentResponse> getMyPayments(
            Authentication authentication) {

        return paymentService.getMyPayments(
                authentication.getName()
        );
    }

    @GetMapping("/policy/{policyNumber}")
    public List<PaymentResponse> getPaymentsForPolicy(
            Authentication authentication,
            @PathVariable String policyNumber) {

        return paymentService.getPaymentsForPolicy(
                authentication.getName(),
                policyNumber
        );
    }
}