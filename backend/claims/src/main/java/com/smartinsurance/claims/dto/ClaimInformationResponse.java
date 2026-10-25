package com.smartinsurance.claims.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ClaimInformationResponse {

    private Long id;

    private String claimNumber;

    private String requestMessage;

    private String customerResponse;

    private String status;

    private LocalDateTime requestedAt;

    private LocalDateTime respondedAt;
}