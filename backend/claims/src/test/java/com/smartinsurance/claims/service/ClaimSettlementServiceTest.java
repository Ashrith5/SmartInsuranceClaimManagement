package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.ClaimSettlementRequest;
import com.smartinsurance.claims.dto.ClaimSettlementResponse;
import com.smartinsurance.claims.entity.Claim;
import com.smartinsurance.claims.entity.ClaimSettlement;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.ClaimHistoryRepository;
import com.smartinsurance.claims.repository.ClaimRepository;
import com.smartinsurance.claims.repository.ClaimSettlementRepository;
import com.smartinsurance.claims.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClaimSettlementServiceTest {

    @Mock
    private ClaimSettlementRepository settlementRepository;

    @Mock
    private ClaimRepository claimRepository;

    @Mock
    private ClaimHistoryRepository claimHistoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ClaimSettlementService settlementService;

    private User officer;
    private Claim claim;
    private ClaimSettlementRequest request;

    @BeforeEach
    void setUp() {

        officer = new User();
        officer.setId(3L);
        officer.setEmail("officer@test.com");

        claim = new Claim();
        claim.setId(1L);
        claim.setClaimNumber(
                "CLM-TEST1234");
        claim.setClaimAmount(
                new BigDecimal("250000"));
        claim.setStatus("APPROVED");

        request =
                new ClaimSettlementRequest();

        request.setSettlementAmount(
                new BigDecimal("250000"));
    }

    @Test
    void shouldSettleApprovedClaim() {

        when(userRepository.findByEmail(
                "officer@test.com"))
                .thenReturn(Optional.of(officer));

        when(claimRepository.findByClaimNumber(
                "CLM-TEST1234"))
                .thenReturn(Optional.of(claim));

        when(settlementRepository
                .existsByClaimId(1L))
                .thenReturn(false);

        when(settlementRepository
                .existsBySettlementNumber(
                        anyString()))
                .thenReturn(false);

        when(settlementRepository
                .existsByPaymentReference(
                        anyString()))
                .thenReturn(false);

        when(settlementRepository
                .save(any(ClaimSettlement.class)))
                .thenAnswer(invocation -> {

                    ClaimSettlement settlement =
                            invocation.getArgument(0);

                    settlement.setId(1L);

                    return settlement;
                });

        when(claimRepository.save(any(Claim.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        ClaimSettlementResponse response =
                settlementService.settleClaim(
                        "officer@test.com",
                        "CLM-TEST1234",
                        request
                );

        assertNotNull(response);
        assertEquals(
                "COMPLETED",
                response.getSettlementStatus());

        assertEquals(
                "SETTLED",
                claim.getStatus());

        verify(claimHistoryRepository)
                .save(any());
    }

    @Test
    void shouldRejectNonApprovedClaim() {

        claim.setStatus("UNDER_REVIEW");

        when(userRepository.findByEmail(
                "officer@test.com"))
                .thenReturn(Optional.of(officer));

        when(claimRepository.findByClaimNumber(
                "CLM-TEST1234"))
                .thenReturn(Optional.of(claim));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () ->
                                settlementService.settleClaim(
                                        "officer@test.com",
                                        "CLM-TEST1234",
                                        request
                                )
                );

        assertEquals(
                "Only approved claims can be settled",
                exception.getMessage());
    }

    @Test
    void shouldRejectSettlementAboveClaimAmount() {

        request.setSettlementAmount(
                new BigDecimal("300000"));

        when(userRepository.findByEmail(
                "officer@test.com"))
                .thenReturn(Optional.of(officer));

        when(claimRepository.findByClaimNumber(
                "CLM-TEST1234"))
                .thenReturn(Optional.of(claim));

        when(settlementRepository
                .existsByClaimId(1L))
                .thenReturn(false);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () ->
                                settlementService.settleClaim(
                                        "officer@test.com",
                                        "CLM-TEST1234",
                                        request
                                )
                );

        assertEquals(
                "Settlement amount cannot exceed the approved claim amount",
                exception.getMessage());
    }
}