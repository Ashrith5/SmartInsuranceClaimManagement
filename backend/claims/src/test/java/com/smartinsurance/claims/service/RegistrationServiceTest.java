package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.RegisterRequest;
import com.smartinsurance.claims.dto.RegisterResponse;
import com.smartinsurance.claims.entity.Role;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.RoleRepository;
import com.smartinsurance.claims.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private RegistrationService registrationService;

    private RegisterRequest request;
    private Role customerRole;

    @BeforeEach
    void setUp() {

        request = new RegisterRequest();
        request.setFirstName("Test");
        request.setLastName("Customer");
        request.setEmail("test.customer@example.com");
        request.setPassword("Test@1234");
        request.setPhone("9876543210");

        customerRole = new Role();
        customerRole.setId(1L);
        customerRole.setName("CUSTOMER");
        customerRole.setDescription("Insurance customer");
    }

    @Test
    void shouldRegisterCustomerSuccessfully() {

        when(userRepository.existsByEmail(
                "test.customer@example.com"))
                .thenReturn(false);

        when(roleRepository.findByName("CUSTOMER"))
                .thenReturn(Optional.of(customerRole));

        when(passwordEncoder.encode("Test@1234"))
                .thenReturn("$2a$hashed");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> {

                    User user =
                            invocation.getArgument(0);

                    user.setId(1L);

                    return user;
                });

        RegisterResponse response =
                registrationService.register(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(
                "test.customer@example.com",
                response.getEmail());
        assertEquals(
                "CUSTOMER",
                response.getRole());
        assertEquals(
                "Registration successful",
                response.getMessage());

        verify(passwordEncoder)
                .encode("Test@1234");

        verify(userRepository)
                .save(any(User.class));
    }

    @Test
    void shouldRejectDuplicateEmail() {

        when(userRepository.existsByEmail(
                "test.customer@example.com"))
                .thenReturn(true);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () ->
                                registrationService
                                        .register(request)
                );

        assertEquals(
                "Email is already registered",
                exception.getMessage());

        verify(userRepository, never())
                .save(any(User.class));
    }
}