package com.warehouse.inventory.dto;

import com.warehouse.inventory.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserDtos {

    public record CreateUserRequest(
            @NotBlank(message = "Username is required") String username,
            @NotBlank(message = "Full name is required") String fullName,
            String email,
            @NotBlank(message = "Password is required") String password,
            @NotNull(message = "Role is required") Role role) {
    }

    public record UserResponse(
            Long id,
            String username,
            String fullName,
            String email,
            String role,
            boolean active) {
    }
}
