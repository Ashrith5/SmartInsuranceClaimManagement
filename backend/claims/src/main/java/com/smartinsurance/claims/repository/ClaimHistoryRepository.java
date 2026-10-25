package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.ClaimHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimHistoryRepository
        extends JpaRepository<ClaimHistory, Long> {

    List<ClaimHistory>
    findByClaimIdOrderByChangedAtAsc(Long claimId);
}