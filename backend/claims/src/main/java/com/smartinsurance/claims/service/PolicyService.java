package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.PolicyPurchaseRequest;
import com.smartinsurance.claims.dto.PolicyResponse;
import com.smartinsurance.claims.entity.InsuranceProduct;
import com.smartinsurance.claims.entity.Policy;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.InsuranceProductRepository;
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
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final InsuranceProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public PolicyResponse purchasePolicy(
            String email,
            PolicyPurchaseRequest request) {

        User user = findUser(email);

        InsuranceProduct product = productRepository
                .findById(request.getProductId())
                .filter(InsuranceProduct::getActive)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Insurance product not found"));

        LocalDate startDate = LocalDate.now();

        LocalDate endDate = startDate.plusMonths(
                product.getPolicyTenureMonths());

        Policy policy = new Policy();

        policy.setPolicyNumber(generatePolicyNumber());
        policy.setUser(user);
        policy.setProduct(product);

        policy.setNomineeName(
                request.getNomineeName().trim());

        policy.setNomineeRelationship(
                request.getNomineeRelationship().trim());

        policy.setStartDate(startDate);
        policy.setEndDate(endDate);

        policy.setPremiumAmount(
                product.getPremiumAmount());

        policy.setStatus("ACTIVE");
        policy.setCancellationRequested(false);

        Policy savedPolicy =
                policyRepository.save(policy);

        return toResponse(savedPolicy);
    }

    @Transactional(readOnly = true)
    public List<PolicyResponse> getMyPolicies(
            String email) {

        User user = findUser(email);

        return policyRepository
                .findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PolicyResponse getMyPolicy(
            String email,
            String policyNumber) {

        User user = findUser(email);

        Policy policy = policyRepository
                .findByPolicyNumber(policyNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Policy not found"));

        validatePolicyOwnership(policy, user);

        return toResponse(policy);
    }

    @Transactional
    public PolicyResponse renewPolicy(
            String email,
            String policyNumber) {

        User user = findUser(email);

        Policy policy = policyRepository
                .findByPolicyNumber(policyNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Policy not found"));

        validatePolicyOwnership(policy, user);

        if ("CANCELLED".equals(policy.getStatus())
                || "CANCEL_PENDING".equals(policy.getStatus())) {

            throw new IllegalArgumentException(
                    "Policy cannot be renewed in its current status");
        }

        LocalDate renewalStart;

        if (policy.getEndDate().isAfter(LocalDate.now())) {
            renewalStart = policy.getEndDate();
        } else {
            renewalStart = LocalDate.now();
        }

        LocalDate renewalEnd =
                renewalStart.plusMonths(
                        policy.getProduct()
                                .getPolicyTenureMonths());

        policy.setStartDate(renewalStart);
        policy.setEndDate(renewalEnd);

        policy.setPremiumAmount(
                policy.getProduct().getPremiumAmount());

        policy.setStatus("ACTIVE");

        return toResponse(
                policyRepository.save(policy));
    }

    @Transactional
    public PolicyResponse requestCancellation(
            String email,
            String policyNumber) {

        User user = findUser(email);

        Policy policy = policyRepository
                .findByPolicyNumber(policyNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Policy not found"));

        validatePolicyOwnership(policy, user);

        if ("CANCELLED".equals(policy.getStatus())) {
            throw new IllegalArgumentException(
                    "Policy is already cancelled");
        }

        if (Boolean.TRUE.equals(
                policy.getCancellationRequested())) {

            throw new IllegalArgumentException(
                    "Cancellation is already requested");
        }

        policy.setCancellationRequested(true);
        policy.setStatus("CANCEL_PENDING");

        return toResponse(
                policyRepository.save(policy));
    }

    @Transactional
    public PolicyResponse approveCancellation(
            String policyNumber) {

        Policy policy = policyRepository
                .findByPolicyNumber(policyNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Policy not found"));

        if (!Boolean.TRUE.equals(
                policy.getCancellationRequested())) {

            throw new IllegalArgumentException(
                    "No cancellation request exists for this policy");
        }

        policy.setStatus("CANCELLED");
        policy.setCancellationRequested(false);

        return toResponse(
                policyRepository.save(policy));
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

    private String generatePolicyNumber() {

        String policyNumber;

        do {
            policyNumber =
                    "POL-" +
                            UUID.randomUUID()
                                    .toString()
                                    .substring(0, 8)
                                    .toUpperCase();

        } while (
                policyRepository
                        .existsByPolicyNumber(policyNumber)
        );

        return policyNumber;
    }

    private PolicyResponse toResponse(
            Policy policy) {

        return new PolicyResponse(
                policy.getId(),
                policy.getPolicyNumber(),

                policy.getProduct().getId(),
                policy.getProduct().getProductName(),
                policy.getProduct().getProductCategory(),

                policy.getNomineeName(),
                policy.getNomineeRelationship(),

                policy.getStartDate(),
                policy.getEndDate(),

                policy.getPremiumAmount(),

                policy.getStatus(),
                policy.getCancellationRequested()
        );
    }
}