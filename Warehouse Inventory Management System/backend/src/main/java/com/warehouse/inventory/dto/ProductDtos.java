package com.warehouse.inventory.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class ProductDtos {

    public record ProductRequest(
            @NotBlank(message = "Name is required") String name,
            @NotBlank(message = "SKU is required") String sku,
            @NotNull(message = "Price is required")
            @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
            BigDecimal price,
            @NotNull(message = "Quantity is required")
            @Min(value = 0, message = "Quantity cannot be negative")
            Integer quantity,
            @Min(value = 0, message = "Low stock threshold cannot be negative")
            Integer lowStockThreshold,
            String imageUrl,
            Long categoryId,
            Long supplierId) {
    }

    public record ProductResponse(
            Long id,
            String name,
            String sku,
            BigDecimal price,
            Integer quantity,
            Integer lowStockThreshold,
            String imageUrl,
            Long categoryId,
            String categoryName,
            Long supplierId,
            String supplierName,
            boolean lowStock) {
    }
}
