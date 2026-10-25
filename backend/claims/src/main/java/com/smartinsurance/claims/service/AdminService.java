package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.AdminUserResponse;
import com.smartinsurance.claims.dto.AssignAgentRequest;
import com.smartinsurance.claims.dto.UpdateUserStatusRequest;
import com.smartinsurance.claims.entity.AgentCustomerAssignment;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.AgentCustomerAssignmentRepository;
import com.smartinsurance.claims.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AgentCustomerAssignmentRepository assignmentRepository;

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminUserResponse updateUserStatus(
            Long userId,
            UpdateUserStatusRequest request) {

        User user = findUser(userId);

        user.setEnabled(request.getEnabled());

        return toResponse(
                userRepository.save(user)
        );
    }

    @Transactional
    public void assignCustomerToAgent(
            AssignAgentRequest request) {

        User agent = findUser(request.getAgentId());
        User customer = findUser(request.getCustomerId());

        if (!"AGENT".equals(agent.getRole().getName())) {
            throw new IllegalArgumentException(
                    "Selected user is not an AGENT");
        }

        if (!"CUSTOMER".equals(customer.getRole().getName())) {
            throw new IllegalArgumentException(
                    "Selected user is not a CUSTOMER");
        }

        if (assignmentRepository
                .existsByAgentIdAndCustomerIdAndActiveTrue(
                        agent.getId(),
                        customer.getId())) {

            throw new IllegalArgumentException(
                    "Customer is already assigned to this agent");
        }

        AgentCustomerAssignment assignment =
                new AgentCustomerAssignment();

        assignment.setAgent(agent);
        assignment.setCustomer(customer);
        assignment.setActive(true);

        assignmentRepository.save(assignment);
    }

    private User findUser(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"));
    }

    private AdminUserResponse toResponse(User user) {

        return new AdminUserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().getName(),
                user.getEnabled()
        );
    }
}