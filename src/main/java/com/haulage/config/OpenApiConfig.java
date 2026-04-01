package com.haulage.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Haulage Truck Management API",
                version = "0.0.1",
                description = "CRUD for Truck/Driver/Job with JWT authentication"
        )
)
@SecurityScheme(
        name = "bearerAuth",
        scheme = "bearer",
        bearerFormat = "JWT",
        type = io.swagger.v3.oas.annotations.enums.SecuritySchemeType.HTTP
)
@SecurityRequirement(name = "bearerAuth")
public class OpenApiConfig {
}

