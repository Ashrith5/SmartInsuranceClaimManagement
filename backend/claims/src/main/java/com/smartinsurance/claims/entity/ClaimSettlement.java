package com.smartinsurance.claims.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "claim_settlements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClaimSettlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "settlement_number",
            nullable = false,
            unique = true,
            length = 50
    )
    private String settlementNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "claim_id",
            nullable = false,
            unique = true
    )
    private Claim claim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "processed_by",
            nullable = false
    )
    private User processedBy;

    @Column(
            name = "settlement_amount",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal settlementAmount;

    @Column(
            name = "payment_reference",
            nullable = false,
            unique = true,
            length = 100
    )
    private String paymentReference;

    @Column(
            name = "settlement_status",
            nullable = false,
            length = 30
    )
    private String settlementStatus = "COMPLETED";

    @Column(
            name = "settled_at",
            nullable = false
    )
    private LocalDateTime settledAt;

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        if (settledAt == null) {
            settledAt = now;
        }

        if (createdAt == null) {
            createdAt = now;
        }
    }
}