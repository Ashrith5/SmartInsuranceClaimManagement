package com.smartinsurance.claims.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "agent_customer_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgentCustomerAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Column(nullable = false)
    private Boolean active = true;

    @PrePersist
    protected void onCreate() {
        if (assignedAt == null) {
            assignedAt = LocalDateTime.now();
        }
    }
}