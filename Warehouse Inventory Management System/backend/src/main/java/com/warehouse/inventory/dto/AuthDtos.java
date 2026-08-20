package com.warehouse.inventory.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Authentication-related request/response payloads.
 */
public class AuthDtos {

    public record LoginRequest(
            @NotBlank(message = "Username is required") String username,
            @NotBlank(message = "Password is required") String password) {
    }

    public record LoginResponse(
            String token,
            String username,
            String fullName,
            String role) {
    }

    public record ChangePasswordRequest(
            @NotBlank(message = "Current password is required") String currentPassword,
            @NotBlank(message = "New password is required") String newPassword) {
    }

    public record UpdateProfileRequest(
            @NotBlank(message = "Full name is required") String fullName,
            String email) {
    }
}
