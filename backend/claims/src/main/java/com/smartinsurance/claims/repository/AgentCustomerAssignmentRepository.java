package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.AgentCustomerAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgentCustomerAssignmentRepository
        extends JpaRepository<AgentCustomerAssignment, Long> {

    List<AgentCustomerAssignment>
    findByAgentIdAndActiveTrue(Long agentId);

    boolean existsByAgentIdAndCustomerIdAndActiveTrue(
            Long agentId,
            Long customerId
    );
}