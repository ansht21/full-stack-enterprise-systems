package com.warehouse.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class InventoryDtos {

    public record StockAdjustRequest(
            @NotNull(message = "Product id is required") Long productId,
            @NotNull(message = "Quantity is required")
            @Min(value = 1, message = "Quantity must be at least 1") Integer quantity,
            String note) {
    }

    public record InventoryLogResponse(
            Long id,
            Long productId,
            String productName,
            String type,
            Integer quantity,
            String note,
            LocalDateTime createdAt) {
    }
}
