package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.dto.ClaimStatusReport;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ReportRepository {

    private final EntityManager entityManager;

    public List<ClaimStatusReport> getClaimStatusSummary() {

        List<Object[]> rows =
                entityManager
                        .createNativeQuery("""
                                SELECT
                                    status,
                                    claim_count,
                                    total_claim_amount,
                                    average_claim_amount
                                FROM vw_claim_status_summary
                                ORDER BY status
                                """)
                        .getResultList();

        return rows.stream()
                .map(row ->
                        new ClaimStatusReport(
                                (String) row[0],
                                ((Number) row[1]).longValue(),
                                (BigDecimal) row[2],
                                (BigDecimal) row[3]
                        ))
                .toList();
    }
}