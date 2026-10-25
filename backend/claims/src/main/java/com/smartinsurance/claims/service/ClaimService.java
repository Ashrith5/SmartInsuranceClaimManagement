package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.ClaimResponse;
import com.smartinsurance.claims.dto.ClaimSubmitRequest;
import com.smartinsurance.claims.entity.Claim;
import com.smartinsurance.claims.entity.Policy;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.ClaimRepository;
import com.smartinsurance.claims.repository.PolicyRepository;
import com.smartinsurance.claims.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;

    @Transactional
    public ClaimResponse submitClaim(
            String email,
            ClaimSubmitRequest request) {

        User user = findUser(email);

        Policy policy = policyRepository
                .findByPolicyNumber(request.getPolicyNumber())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Policy not found"));

        validatePolicyOwnership(policy, user);

        if (!"ACTIVE".equals(policy.getStatus())) {
            throw new IllegalArgumentException(
                    "Claims can only be submitted for active policies");
        }

        if (request.getIncidentDate()
                .isAfter(LocalDate.now())) {

            throw new IllegalArgumentException(
                    "Incident date cannot be in the future");
        }

        if (request.getIncidentDate()
                .isBefore(policy.getStartDate())
                || request.getIncidentDate()
                .isAfter(policy.getEndDate())) {

            throw new IllegalArgumentException(
                    "Incident date must be within the policy coverage period");
        }

        if (request.getClaimAmount()
                .compareTo(
                        policy.getProduct()
                                .getCoverageAmount()) > 0) {

            throw new IllegalArgumentException(
                    "Claim amount cannot exceed policy coverage amount");
        }

        Claim claim = new Claim();

        claim.setClaimNumber(
                generateClaimNumber());

        claim.setPolicy(policy);
        claim.setUser(user);

        claim.setClaimType(
                request.getClaimType()
                        .trim()
                        .toUpperCase());

        claim.setIncidentDate(
                request.getIncidentDate());

        claim.setClaimAmount(
                request.getClaimAmount());

        claim.setDescription(
                request.getDescription().trim());

        claim.setStatus("SUBMITTED");

        Claim savedClaim =
                claimRepository.save(claim);

        return toResponse(savedClaim);
    }

    @Transactional(readOnly = true)
    public List<ClaimResponse> getMyClaims(
            String email) {

        User user = findUser(email);

        return claimRepository
                .findByUserIdOrderBySubmittedAtDesc(
                        user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClaimResponse getMyClaim(
            String email,
            String claimNumber) {

        User user = findUser(email);

        Claim claim = claimRepository
                .findByClaimNumber(claimNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Claim not found"));

        if (!claim.getUser().getId()
                .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "Claim does not belong to this customer");
        }

        return toResponse(claim);
    }

    private User findUser(String email) {

        return userRepository
                .findByEmail(email.toLowerCase())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Customer not found"));
    }

    private void validatePolicyOwnership(
            Policy policy,
            User user) {

        if (!policy.getUser().getId()
                .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "Policy does not belong to this customer");
        }
    }

    private String generateClaimNumber() {

        String claimNumber;

        do {
            claimNumber =
                    "CLM-" +
                            UUID.randomUUID()
                                    .toString()
                                    .substring(0, 8)
                                    .toUpperCase();

        } while (
                claimRepository
                        .existsByClaimNumber(claimNumber)
        );

        return claimNumber;
    }

    private ClaimResponse toResponse(
            Claim claim) {

        return new ClaimResponse(
                claim.getId(),
                claim.getClaimNumber(),

                claim.getPolicy().getPolicyNumber(),

                claim.getPolicy()
                        .getProduct()
                        .getProductName(),

                claim.getPolicy()
                        .getProduct()
                        .getProductCategory(),

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