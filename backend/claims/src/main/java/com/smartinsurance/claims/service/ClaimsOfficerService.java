package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.ClaimDecisionRequest;
import com.smartinsurance.claims.dto.ClaimResponse;
import com.smartinsurance.claims.entity.Claim;
import com.smartinsurance.claims.entity.ClaimHistory;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.ClaimHistoryRepository;
import com.smartinsurance.claims.repository.ClaimRepository;
import com.smartinsurance.claims.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimsOfficerService {

    private final ClaimRepository claimRepository;
    private final ClaimHistoryRepository claimHistoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ClaimResponse> getSubmittedClaims() {

        return claimRepository
                .findByStatusOrderBySubmittedAtAsc("SUBMITTED")
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClaimResponse getClaim(
            String claimNumber) {

        return toResponse(
                findClaim(claimNumber)
        );
    }

    @Transactional
    public ClaimResponse startReview(
            String officerEmail,
            String claimNumber) {

        User officer = findUser(officerEmail);
        Claim claim = findClaim(claimNumber);

        if (!"SUBMITTED".equals(claim.getStatus())) {
            throw new IllegalArgumentException(
                    "Only submitted claims can be moved to review");
        }

        String previousStatus = claim.getStatus();

        claim.setStatus("UNDER_REVIEW");
        claim.setReviewedAt(LocalDateTime.now());

        Claim savedClaim =
                claimRepository.save(claim);

        createHistory(
                savedClaim,
                previousStatus,
                "UNDER_REVIEW",
                officer,
                "REVIEW_STARTED",
                "Claims Officer started claim review"
        );

        return toResponse(savedClaim);
    }

    @Transactional
    public ClaimResponse approveClaim(
            String officerEmail,
            String claimNumber,
            ClaimDecisionRequest request) {

        User officer = findUser(officerEmail);
        Claim claim = findClaim(claimNumber);

        if (!"UNDER_REVIEW".equals(claim.getStatus())) {
            throw new IllegalArgumentException(
                    "Only claims under review can be approved");
        }

        String previousStatus = claim.getStatus();
        String reason = request.getReason().trim();

        claim.setStatus("APPROVED");
        claim.setDecisionReason(reason);
        claim.setReviewedAt(LocalDateTime.now());

        Claim savedClaim =
                claimRepository.save(claim);

        createHistory(
                savedClaim,
                previousStatus,
                "APPROVED",
                officer,
                "CLAIM_APPROVED",
                reason
        );

        return toResponse(savedClaim);
    }

    @Transactional
    public ClaimResponse rejectClaim(
            String officerEmail,
            String claimNumber,
            ClaimDecisionRequest request) {

        User officer = findUser(officerEmail);
        Claim claim = findClaim(claimNumber);

        if (!"UNDER_REVIEW".equals(claim.getStatus())) {
            throw new IllegalArgumentException(
                    "Only claims under review can be rejected");
        }

        String previousStatus = claim.getStatus();
        String reason = request.getReason().trim();

        claim.setStatus("REJECTED");
        claim.setDecisionReason(reason);
        claim.setReviewedAt(LocalDateTime.now());

        Claim savedClaim =
                claimRepository.save(claim);

        createHistory(
                savedClaim,
                previousStatus,
                "REJECTED",
                officer,
                "CLAIM_REJECTED",
                reason
        );

        return toResponse(savedClaim);
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
                                "Claims Officer not found"));
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

    private ClaimResponse toResponse(
            Claim claim) {

        return new ClaimResponse(
                claim.getId(),
                claim.getClaimNumber(),
                claim.getPolicy().getPolicyNumber(),
                claim.getPolicy().getProduct().getProductName(),
                claim.getPolicy().getProduct().getProductCategory(),
                claim.getClaimType(),
                claim.getIncidentDate(),
                claim.getClaimAmount(),
                claim.getDescription(),
                claim.getStatus(),
                claim.getSubmittedAt(),
                claim.getReviewedAt(),
                claim.getDecisionReason()
        );
    }
}