package com.smartinsurance.claims.config;

import com.smartinsurance.claims.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Public authentication APIs
                        .requestMatchers(
                                "/api/v1/auth/register",
                                "/api/v1/auth/login"
                        ).permitAll()

                        // Swagger / OpenAPI
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // Administrator
                        .requestMatchers("/api/v1/admin/**")
                        .hasRole("ADMIN")

                        // Claims Officer
                        .requestMatchers("/api/v1/officer/**")
                        .hasRole("CLAIMS_OFFICER")

                        // Agent
                        .requestMatchers("/api/v1/agent/**")
                        .hasRole("AGENT")

                        // Customer
                        .requestMatchers("/api/v1/policies/**")
                        .hasRole("CUSTOMER")

                        .requestMatchers("/api/v1/payments/**")
                        .hasRole("CUSTOMER")

                        .requestMatchers("/api/v1/claims/**")
                        .hasRole("CUSTOMER")

                        // Shared authenticated catalog
                        .requestMatchers("/api/v1/products/**")
                        .authenticated()

                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}