package com.smartinsurance.claims.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "claim_information_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClaimInformationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    @Column(name = "request_message", nullable = false, length = 1000)
    private String requestMessage;

    @Column(name = "customer_response", length = 1000)
    private String customerResponse;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(nullable = false, length = 30)
    private String status = "OPEN";

    @PrePersist
    protected void onCreate() {
        if (requestedAt == null) {
            requestedAt = LocalDateTime.now();
        }
    }
}