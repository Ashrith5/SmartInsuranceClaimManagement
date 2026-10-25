package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.ClaimSettlementRequest;
import com.smartinsurance.claims.dto.ClaimSettlementResponse;
import com.smartinsurance.claims.entity.Claim;
import com.smartinsurance.claims.entity.ClaimHistory;
import com.smartinsurance.claims.entity.ClaimSettlement;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.ClaimHistoryRepository;
import com.smartinsurance.claims.repository.ClaimRepository;
import com.smartinsurance.claims.repository.ClaimSettlementRepository;
import com.smartinsurance.claims.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClaimSettlementService {

    private final ClaimSettlementRepository settlementRepository;
    private final ClaimRepository claimRepository;
    private final ClaimHistoryRepository claimHistoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public ClaimSettlementResponse settleClaim(
            String officerEmail,
            String claimNumber,
            ClaimSettlementRequest request) {

        User officer = findUser(officerEmail);
        Claim claim = findClaim(claimNumber);

        if (!"APPROVED".equals(claim.getStatus())) {
            throw new IllegalArgumentException(
                    "Only approved claims can be settled");
        }

        if (settlementRepository.existsByClaimId(
                claim.getId())) {

            throw new IllegalArgumentException(
                    "Settlement already exists for this claim");
        }

        BigDecimal settlementAmount =
                request.getSettlementAmount();

        if (settlementAmount.compareTo(
                claim.getClaimAmount()) > 0) {

            throw new IllegalArgumentException(
                    "Settlement amount cannot exceed the approved claim amount");
        }

        String previousStatus = claim.getStatus();

        ClaimSettlement settlement =
                new ClaimSettlement();

        settlement.setSettlementNumber(
                generateSettlementNumber());

        settlement.setClaim(claim);
        settlement.setProcessedBy(officer);
        settlement.setSettlementAmount(
                settlementAmount);

        settlement.setPaymentReference(
                generatePaymentReference());

        settlement.setSettlementStatus(
                "COMPLETED");

        ClaimSettlement savedSettlement =
                settlementRepository.save(settlement);

        claim.setStatus("SETTLED");
        claimRepository.save(claim);

        createHistory(
                claim,
                previousStatus,
                "SETTLED",
                officer,
                "CLAIM_SETTLED",
                "Claim settled for amount " +
                        settlementAmount
        );

        return toResponse(savedSettlement);
    }

    @Transactional(readOnly = true)
    public ClaimSettlementResponse getCustomerSettlement(
            String customerEmail,
            String claimNumber) {

        User customer = findUser(customerEmail);
        Claim claim = findClaim(claimNumber);

        if (!claim.getUser()
                .getId()
                .equals(customer.getId())) {

            throw new IllegalArgumentException(
                    "Claim does not belong to this customer");
        }

        ClaimSettlement settlement =
                settlementRepository
                        .findByClaimId(claim.getId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Settlement not found"));

        return toResponse(settlement);
    }

    @Transactional(readOnly = true)
    public ClaimSettlementResponse getOfficerSettlement(
            String claimNumber) {

        Claim claim = findClaim(claimNumber);

        ClaimSettlement settlement =
                settlementRepository
                        .findByClaimId(claim.getId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Settlement not found"));

        return toResponse(settlement);
    }

    private Claim findClaim(
            String claimNumber) {

        return claimRepository
                .findByClaimNumber(claimNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Claim not found"));
    }

    private User findUser(
            String email) {

        return userRepository
                .findByEmail(email.toLowerCase())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"));
    }

    private String generateSettlementNumber() {

        String settlementNumber;

        do {
            settlementNumber =
                    "STL-" +
                            UUID.randomUUID()
                                    .toString()
                                    .substring(0, 10)
                                    .toUpperCase();

        } while (
                settlementRepository
                        .existsBySettlementNumber(
                                settlementNumber)
        );

        return settlementNumber;
    }

    private String generatePaymentReference() {

        String paymentReference;

        do {
            paymentReference =
                    "PAY-" +
                            UUID.randomUUID()
                                    .toString()
                                    .substring(0, 12)
                                    .toUpperCase();

        } while (
                settlementRepository
                        .existsByPaymentReference(
                                paymentReference)
        );

        return paymentReference;
    }

    private void createHistory(
            Claim claim,
            String previousStatus,
            String newStatus,
            User changedBy,
            String action,
            String remarks) {

        ClaimHistory history =
                new ClaimHistory();

        history.setClaim(claim);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy);
        history.setAction(action);
        history.setRemarks(remarks);

        claimHistoryRepository.save(history);
    }

    private ClaimSettlementResponse toResponse(
            ClaimSettlement settlement) {

        return new ClaimSettlementResponse(
                settlement.getId(),
                settlement.getSettlementNumber(),
                settlement.getClaim().getClaimNumber(),
                settlement.getClaim().getClaimAmount(),
                settlement.getSettlementAmount(),
                settlement.getPaymentReference(),
                settlement.getSettlementStatus(),
                settlement.getSettledAt()
        );
    }
}