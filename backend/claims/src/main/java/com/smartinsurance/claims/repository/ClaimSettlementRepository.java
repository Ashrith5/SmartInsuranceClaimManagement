package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.ClaimSettlement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClaimSettlementRepository
        extends JpaRepository<ClaimSettlement, Long> {

    Optional<ClaimSettlement>
    findByClaimId(Long claimId);

    boolean existsByClaimId(Long claimId);

    boolean existsBySettlementNumber(
            String settlementNumber);

    boolean existsByPaymentReference(
            String paymentReference);
}