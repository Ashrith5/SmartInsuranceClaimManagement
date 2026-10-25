package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.ClaimResponse;
import com.smartinsurance.claims.dto.ClaimSubmitRequest;
import com.smartinsurance.claims.entity.InsuranceProduct;
import com.smartinsurance.claims.entity.Policy;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.ClaimRepository;
import com.smartinsurance.claims.repository.PolicyRepository;
import com.smartinsurance.claims.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClaimServiceTest {

    @Mock
    private ClaimRepository claimRepository;

    @Mock
    private PolicyRepository policyRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ClaimService claimService;

    private User customer;
    private Policy policy;
    private ClaimSubmitRequest request;

    @BeforeEach
    void setUp() {

        customer = new User();
        customer.setId(1L);
        customer.setEmail(
                "test.customer@example.com");

        InsuranceProduct product =
                new InsuranceProduct();

        product.setId(2L);
        product.setProductName(
                "Smart Motor Protect");
        product.setProductCategory("MOTOR");
        product.setCoverageAmount(
                new BigDecimal("800000"));
        product.setPremiumAmount(
                new BigDecimal("15000"));
        product.setPolicyTenureMonths(12);
        product.setActive(true);

        policy = new Policy();
        policy.setId(2L);
        policy.setPolicyNumber(
                "POL-TEST1234");
        policy.setUser(customer);
        policy.setProduct(product);
        policy.setStatus("ACTIVE");
        policy.setStartDate(
                LocalDate.now().minusMonths(1));
        policy.setEndDate(
                LocalDate.now().plusMonths(11));

        request = new ClaimSubmitRequest();
        request.setPolicyNumber(
                "POL-TEST1234");
        request.setClaimType("ACCIDENT");
        request.setIncidentDate(
                LocalDate.now());
        request.setClaimAmount(
                new BigDecimal("250000"));
        request.setDescription(
                "Vehicle damage test claim.");
    }

    @Test
    void shouldSubmitClaimSuccessfully() {

        when(userRepository.findByEmail(
                "test.customer@example.com"))
                .thenReturn(Optional.of(customer));

        when(policyRepository.findByPolicyNumber(
                "POL-TEST1234"))
                .thenReturn(Optional.of(policy));

        when(claimRepository
                .existsByClaimNumber(anyString()))
                .thenReturn(false);

        when(claimRepository.save(any()))
                .thenAnswer(invocation -> {

                    var claim =
                            invocation.getArgument(
                                    0,
                                    com.smartinsurance.claims.entity.Claim.class
                            );

                    claim.setId(1L);

                    return claim;
                });

        ClaimResponse response =
                claimService.submitClaim(
                        "test.customer@example.com",
                        request
                );

        assertNotNull(response);
        assertEquals(
                "SUBMITTED",
                response.getStatus());
        assertEquals(
                new BigDecimal("250000"),
                response.getClaimAmount());
        assertTrue(
                response.getClaimNumber()
                        .startsWith("CLM-"));
    }

    @Test
    void shouldRejectClaimAboveCoverage() {

        request.setClaimAmount(
                new BigDecimal("900000"));

        when(userRepository.findByEmail(
                "test.customer@example.com"))
                .thenReturn(Optional.of(customer));

        when(policyRepository.findByPolicyNumber(
                "POL-TEST1234"))
                .thenReturn(Optional.of(policy));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () ->
                                claimService.submitClaim(
                                        "test.customer@example.com",
                                        request
                                )
                );

        assertEquals(
                "Claim amount cannot exceed policy coverage amount",
                exception.getMessage());
    }

    @Test
    void shouldRejectInactivePolicy() {

        policy.setStatus("CANCELLED");

        when(userRepository.findByEmail(
                "test.customer@example.com"))
                .thenReturn(Optional.of(customer));

        when(policyRepository.findByPolicyNumber(
                "POL-TEST1234"))
                .thenReturn(Optional.of(policy));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () ->
                                claimService.submitClaim(
                                        "test.customer@example.com",
                                        request
                                )
                );

        assertEquals(
                "Claims can only be submitted for active policies",
                exception.getMessage());

        verify(claimRepository, never())
                .save(any());
    }
}