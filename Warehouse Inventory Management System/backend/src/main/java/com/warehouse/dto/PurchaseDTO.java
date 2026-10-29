package com.warehouse.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class PurchaseDTO {

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    private String notes;

    private java.util.List<PurchaseItemDTO> items;

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public java.util.List<PurchaseItemDTO> getItems() { return items; }
    public void setItems(java.util.List<PurchaseItemDTO> items) { this.items = items; }

    public static class PurchaseItemDTO {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Quantity is required")
        private Integer quantity;

        private BigDecimal unitPrice;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    }
}
