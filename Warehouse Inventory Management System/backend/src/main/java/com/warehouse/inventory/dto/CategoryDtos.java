package com.warehouse.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryDtos {

    public record CategoryRequest(
            @NotBlank(message = "Name is required")
            @Size(max = 100, message = "Name must be at most 100 characters")
            String name,
            @Size(max = 255, message = "Description must be at most 255 characters")
            String description) {
    }

    public record CategoryResponse(Long id, String name, String description) {
    }
}
