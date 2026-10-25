package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.ClaimHistoryResponse;
import com.smartinsurance.claims.dto.ClaimInfoRequest;
import com.smartinsurance.claims.dto.ClaimInfoResponse;
import com.smartinsurance.claims.dto.ClaimInformationResponse;
import com.smartinsurance.claims.entity.Claim;
import com.smartinsurance.claims.entity.ClaimHistory;
import com.smartinsurance.claims.entity.ClaimInformationRequest;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.ClaimHistoryRepository;
import com.smartinsurance.claims.repository.ClaimInformationRequestRepository;
import com.smartinsurance.claims.repository.ClaimRepository;
import com.smartinsurance.claims.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimWorkflowService {

    private final ClaimRepository claimRepository;
    private final ClaimInformationRequestRepository
            informationRequestRepository;
    private final ClaimHistoryRepository claimHistoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public ClaimInformationResponse requestInformation(
            String officerEmail,
            String claimNumber,
            ClaimInfoRequest request) {

        User officer = findUser(officerEmail);
        Claim claim = findClaim(claimNumber);

        if (!"UNDER_REVIEW".equals(claim.getStatus())) {
            throw new IllegalArgumentException(
                    "Information can only be requested for claims under review");
        }

        String previousStatus = claim.getStatus();

        ClaimInformationRequest infoRequest =
                new ClaimInformationRequest();

        infoRequest.setClaim(claim);
        infoRequest.setRequestedBy(officer);
        infoRequest.setRequestMessage(
                request.getMessage().trim());
        infoRequest.setStatus("OPEN");

        ClaimInformationRequest savedRequest =
                informationRequestRepository.save(infoRequest);

        claim.setStatus("INFO_REQUESTED");
        claimRepository.save(claim);

        createHistory(
                claim,
                previousStatus,
                "INFO_REQUESTED",
                officer,
                "INFORMATION_REQUESTED",
                request.getMessage().trim()
        );

        return toInformationResponse(savedRequest);
    }

    @Transactional
    public ClaimInformationResponse respondToInformation(
            String customerEmail,
            String claimNumber,
            ClaimInfoResponse response) {

        User customer = findUser(customerEmail);
        Claim claim = findClaim(claimNumber);

        validateClaimOwnership(claim, customer);

        if (!"INFO_REQUESTED".equals(claim.getStatus())) {
            throw new IllegalArgumentException(
                    "No information response is currently required");
        }

        ClaimInformationRequest infoRequest =
                informationRequestRepository
                        .findFirstByClaimIdAndStatusOrderByRequestedAtDesc(
                                claim.getId(),
                                "OPEN"
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Open information request not found"));

        String previousStatus = claim.getStatus();

        infoRequest.setCustomerResponse(
                response.getMessage().trim());

        infoRequest.setRespondedAt(
                LocalDateTime.now());

        infoRequest.setStatus("RESPONDED");

        informationRequestRepository.save(infoRequest);

        claim.setStatus("UNDER_REVIEW");
        claimRepository.save(claim);

        createHistory(
                claim,
                previousStatus,
                "UNDER_REVIEW",
                customer,
                "INFORMATION_RESPONDED",
                response.getMessage().trim()
        );

        return toInformationResponse(infoRequest);
    }

    @Transactional(readOnly = true)
    public List<ClaimInformationResponse> getInformationRequests(
            String customerEmail,
            String claimNumber) {

        User customer = findUser(customerEmail);
        Claim claim = findClaim(claimNumber);

        validateClaimOwnership(claim, customer);

        return informationRequestRepository
                .findByClaimIdOrderByRequestedAtDesc(
                        claim.getId())
                .stream()
                .map(this::toInformationResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClaimHistoryResponse> getCustomerClaimHistory(
            String customerEmail,
            String claimNumber) {

        User customer = findUser(customerEmail);
        Claim claim = findClaim(claimNumber);

        validateClaimOwnership(claim, customer);

        return getHistory(claim);
    }

    @Transactional(readOnly = true)
    public List<ClaimHistoryResponse> getOfficerClaimHistory(
            String claimNumber) {

        Claim claim = findClaim(claimNumber);

        return getHistory(claim);
    }

    private List<ClaimHistoryResponse> getHistory(
            Claim claim) {

        return claimHistoryRepository
                .findByClaimIdOrderByChangedAtAsc(
                        claim.getId())
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    private Claim findClaim(String claimNumber) {

        return claimRepository
                .findByClaimNumber(claimNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Claim not found"));
    }

    private User findUser(String email) {

        return userRepository
                .findByEmail(email.toLowerCase())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"));
    }

    private void validateClaimOwnership(
            Claim claim,
            User customer) {

        if (!claim.getUser().getId()
                .equals(customer.getId())) {

            throw new IllegalArgumentException(
                    "Claim does not belong to this customer");
        }
    }

    private void createHistory(
            Claim claim,
            String previousStatus,
            String newStatus,
            User changedBy,
            String action,
            String remarks) {

        ClaimHistory history =
                new ClaimHistory();

        history.setClaim(claim);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy);
        history.setAction(action);
        history.setRemarks(remarks);

        claimHistoryRepository.save(history);
    }

    private ClaimInformationResponse toInformationResponse(
            ClaimInformationRequest request) {

        return new ClaimInformationResponse(
                request.getId(),
                request.getClaim().getClaimNumber(),
                request.getRequestMessage(),
                request.getCustomerResponse(),
                request.getStatus(),
                request.getRequestedAt(),
                request.getRespondedAt()
        );
    }

    private ClaimHistoryResponse toHistoryResponse(
            ClaimHistory history) {

        return new ClaimHistoryResponse(
                history.getId(),
                history.getClaim().getClaimNumber(),
                history.getPreviousStatus(),
                history.getNewStatus(),
                history.getChangedBy().getEmail(),
                history.getAction(),
                history.getRemarks(),
                history.getChangedAt()
        );
    }
}