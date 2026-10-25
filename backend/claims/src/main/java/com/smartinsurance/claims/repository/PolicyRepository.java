package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {

    List<Policy> findByUserId(Long userId);

    List<Policy> findByUserIdAndStatus(Long userId, String status);

    Optional<Policy> findByPolicyNumber(String policyNumber);

    boolean existsByPolicyNumber(String policyNumber);
}