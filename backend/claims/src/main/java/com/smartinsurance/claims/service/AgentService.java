package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.AgentCustomerResponse;
import com.smartinsurance.claims.dto.ClaimResponse;
import com.smartinsurance.claims.dto.PolicyResponse;
import com.smartinsurance.claims.entity.AgentCustomerAssignment;
import com.smartinsurance.claims.entity.Claim;
import com.smartinsurance.claims.entity.Policy;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.AgentCustomerAssignmentRepository;
import com.smartinsurance.claims.repository.ClaimRepository;
import com.smartinsurance.claims.repository.PolicyRepository;
import com.smartinsurance.claims.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final AgentCustomerAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;

    @Transactional(readOnly = true)
    public List<AgentCustomerResponse> getAssignedCustomers(
            String agentEmail) {

        User agent = findUser(agentEmail);

        return assignmentRepository
                .findByAgentIdAndActiveTrue(agent.getId())
                .stream()
                .map(AgentCustomerAssignment::getCustomer)
                .map(customer ->
                        new AgentCustomerResponse(
                                customer.getId(),
                                customer.getFirstName(),
                                customer.getLastName(),
                                customer.getEmail(),
                                customer.getPhone()
                        ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PolicyResponse> getCustomerPolicies(
            String agentEmail,
            Long customerId) {

        User agent = findUser(agentEmail);

        validateAssignment(agent, customerId);

        return policyRepository
                .findByUserId(customerId)
                .stream()
                .map(this::toPolicyResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClaimResponse> getCustomerClaims(
            String agentEmail,
            Long customerId) {

        User agent = findUser(agentEmail);

        validateAssignment(agent, customerId);

        return claimRepository
                .findByUserIdOrderBySubmittedAtDesc(customerId)
                .stream()
                .map(this::toClaimResponse)
                .toList();
    }

    private void validateAssignment(
            User agent,
            Long customerId) {

        boolean assigned =
                assignmentRepository
                        .existsByAgentIdAndCustomerIdAndActiveTrue(
                                agent.getId(),
                                customerId
                        );

        if (!assigned) {
            throw new IllegalArgumentException(
                    "Customer is not assigned to this agent");
        }
    }

    private User findUser(String email) {

        return userRepository
                .findByEmail(email.toLowerCase())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Agent not found"));
    }

    private PolicyResponse toPolicyResponse(
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

    private ClaimResponse toClaimResponse(
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