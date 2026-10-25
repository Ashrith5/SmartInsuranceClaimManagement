package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.ClaimInformationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClaimInformationRequestRepository
        extends JpaRepository<ClaimInformationRequest, Long> {

    List<ClaimInformationRequest>
    findByClaimIdOrderByRequestedAtDesc(Long claimId);

    Optional<ClaimInformationRequest>
    findFirstByClaimIdAndStatusOrderByRequestedAtDesc(
            Long claimId,
            String status
    );
}