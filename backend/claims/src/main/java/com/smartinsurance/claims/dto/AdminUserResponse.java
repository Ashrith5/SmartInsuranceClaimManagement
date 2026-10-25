package com.smartinsurance.claims.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminUserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String role;
    private Boolean enabled;
}