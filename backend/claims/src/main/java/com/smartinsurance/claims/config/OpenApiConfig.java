package com.smartinsurance.claims.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME =
            "bearerAuth";

    @Bean
    public OpenAPI smartInsuranceOpenAPI() {

        return new OpenAPI()
                .info(
                        new Info()
                                .title(
                                        "Smart Insurance Claim Management System API"
                                )
                                .version("1.0")
                                .description(
                                        "REST API documentation for the Smart Insurance Claim Management System"
                                )
                )
                .addSecurityItem(
                        new SecurityRequirement()
                                .addList(SECURITY_SCHEME)
                )
                .components(
                        new Components()
                                .addSecuritySchemes(
                                        SECURITY_SCHEME,
                                        new SecurityScheme()
                                                .name(SECURITY_SCHEME)
                                                .type(
                                                        SecurityScheme.Type.HTTP
                                                )
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                )
                );
    }
}