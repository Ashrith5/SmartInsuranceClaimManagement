package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.PaymentRequest;
import com.smartinsurance.claims.dto.PaymentResponse;
import com.smartinsurance.claims.entity.Payment;
import com.smartinsurance.claims.entity.Policy;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.PaymentRepository;
import com.smartinsurance.claims.repository.PolicyRepository;
import com.smartinsurance.claims.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final Set<String> ALLOWED_PAYMENT_METHODS =
            Set.of("CARD", "UPI", "NET_BANKING");

    private final PaymentRepository paymentRepository;
    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;

    @Transactional
    public PaymentResponse makePayment(
            String email,
            PaymentRequest request) {

        User user = findUser(email);

        Policy policy = policyRepository
                .findByPolicyNumber(request.getPolicyNumber())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Policy not found"));

        if (!policy.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "Policy does not belong to this customer");
        }

        if ("CANCELLED".equals(policy.getStatus())) {
            throw new IllegalArgumentException(
                    "Payment cannot be made for a cancelled policy");
        }

        String paymentMethod =
                request.getPaymentMethod()
                        .trim()
                        .toUpperCase();

        if (!ALLOWED_PAYMENT_METHODS.contains(paymentMethod)) {
            throw new IllegalArgumentException(
                    "Invalid payment method. Allowed methods are CARD, UPI, NET_BANKING");
        }

        Payment payment = new Payment();

        payment.setTransactionId(
                generateTransactionId());

        payment.setPolicy(policy);
        payment.setUser(user);

        payment.setAmount(
                policy.getPremiumAmount());

        payment.setPaymentMethod(paymentMethod);

        // Simulated payment processing
        payment.setPaymentStatus("SUCCESS");

        Payment savedPayment =
                paymentRepository.save(payment);

        return toResponse(savedPayment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getMyPayments(
            String email) {

        User user = findUser(email);

        return paymentRepository
                .findByUserIdOrderByPaymentDateDesc(
                        user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsForPolicy(
            String email,
            String policyNumber) {

        User user = findUser(email);

        Policy policy = policyRepository
                .findByPolicyNumber(policyNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Policy not found"));

        if (!policy.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "Policy does not belong to this customer");
        }

        return paymentRepository
                .findByPolicyIdOrderByPaymentDateDesc(
                        policy.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private User findUser(String email) {

        return userRepository
                .findByEmail(email.toLowerCase())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Customer not found"));
    }

    private String generateTransactionId() {

        String transactionId;

        do {
            transactionId =
                    "TXN-" +
                            UUID.randomUUID()
                                    .toString()
                                    .substring(0, 12)
                                    .toUpperCase();

        } while (
                paymentRepository
                        .existsByTransactionId(transactionId)
        );

        return transactionId;
    }

    private PaymentResponse toResponse(
            Payment payment) {

        return new PaymentResponse(
                payment.getId(),
                payment.getTransactionId(),

                payment.getPolicy().getPolicyNumber(),

                payment.getAmount(),

                payment.getPaymentMethod(),
                payment.getPaymentStatus(),

                payment.getPaymentDate()
        );
    }
}