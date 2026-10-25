package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClaimRepository
        extends JpaRepository<Claim, Long> {

    Optional<Claim> findByClaimNumber(
            String claimNumber);

    boolean existsByClaimNumber(
            String claimNumber);

    List<Claim> findByUserIdOrderBySubmittedAtDesc(
            Long userId);

    List<Claim> findByStatusOrderBySubmittedAtAsc(
            String status);
}