package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    List<Payment> findByUserIdOrderByPaymentDateDesc(
            Long userId);

    List<Payment> findByPolicyIdOrderByPaymentDateDesc(
            Long policyId);

    Optional<Payment> findByTransactionId(
            String transactionId);

    boolean existsByTransactionId(
            String transactionId);
}