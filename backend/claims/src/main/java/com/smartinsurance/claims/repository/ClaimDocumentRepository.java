package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.ClaimDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClaimDocumentRepository
        extends JpaRepository<ClaimDocument, Long> {

    List<ClaimDocument>
    findByClaimIdOrderByUploadedAtDesc(Long claimId);

    Optional<ClaimDocument>
    findByIdAndClaimId(
            Long id,
            Long claimId
    );
}