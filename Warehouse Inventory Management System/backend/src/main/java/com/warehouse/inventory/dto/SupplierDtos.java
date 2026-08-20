package com.warehouse.inventory.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class SupplierDtos {

    public record SupplierRequest(
            @NotBlank(message = "Name is required") String name,
            @Email(message = "Invalid email") String email,
            String phone,
            String address) {
    }

    public record SupplierResponse(Long id, String name, String email, String phone, String address) {
    }
}
