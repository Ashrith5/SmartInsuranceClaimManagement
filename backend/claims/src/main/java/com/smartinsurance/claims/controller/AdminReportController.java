package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.ClaimStatusReport;
import com.smartinsurance.claims.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/reports")
@RequiredArgsConstructor
public class AdminReportController {

    private final ReportRepository reportRepository;

    @GetMapping("/claims/status-summary")
    public List<ClaimStatusReport> getClaimStatusSummary() {

        return reportRepository
                .getClaimStatusSummary();
    }
}