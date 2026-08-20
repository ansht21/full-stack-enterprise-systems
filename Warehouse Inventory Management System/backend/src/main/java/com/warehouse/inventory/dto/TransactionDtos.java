package com.warehouse.inventory.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Payloads for purchases and sales (shared line-item shape).
 */
public class TransactionDtos {

    public record LineItemRequest(
            @NotNull(message = "Product id is required") Long productId,
            @NotNull(message = "Quantity is required")
            @Min(value = 1, message = "Quantity must be at least 1") Integer quantity,
            @NotNull(message = "Unit price is required")
            @DecimalMin(value = "0.0", inclusive = false, message = "Unit price must be positive")
            BigDecimal unitPrice) {
    }

    public record PurchaseRequest(
            Long supplierId,
            @NotEmpty(message = "At least one item is required")
            @Valid List<LineItemRequest> items) {
    }

    public record SaleRequest(
            String customerName,
            @NotEmpty(message = "At least one item is required")
            @Valid List<LineItemRequest> items) {
    }

    public record LineItemResponse(
            Long productId,
            String productName,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal subtotal) {
    }

    public record PurchaseResponse(
            Long id,
            String referenceNo,
            Long supplierId,
            String supplierName,
            BigDecimal totalAmount,
            List<LineItemResponse> items,
            LocalDateTime createdAt) {
    }

    public record SaleResponse(
            Long id,
            String invoiceNo,
            String customerName,
            BigDecimal totalAmount,
            List<LineItemResponse> items,
            LocalDateTime createdAt) {
    }
}
