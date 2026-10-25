package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.AdminUserResponse;
import com.smartinsurance.claims.dto.AssignAgentRequest;
import com.smartinsurance.claims.dto.UpdateUserStatusRequest;
import com.smartinsurance.claims.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public List<AdminUserResponse> getUsers() {

        return adminService.getUsers();
    }

    @PatchMapping("/users/{userId}/status")
    public AdminUserResponse updateUserStatus(
            @PathVariable Long userId,
            @Valid @RequestBody
            UpdateUserStatusRequest request) {

        return adminService.updateUserStatus(
                userId,
                request
        );
    }

    @PostMapping("/agent-assignments")
    @ResponseStatus(HttpStatus.CREATED)
    public void assignCustomerToAgent(
            @Valid @RequestBody
            AssignAgentRequest request) {

        adminService.assignCustomerToAgent(request);
    }
}