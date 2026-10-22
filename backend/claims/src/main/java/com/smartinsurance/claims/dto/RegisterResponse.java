package com.smartinsurance.claims.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegisterResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String message;
}