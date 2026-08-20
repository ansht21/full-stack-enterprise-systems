package com.warehouse.inventory.service;

import com.warehouse.inventory.dto.TransactionDtos.*;
import com.warehouse.inventory.entity.*;
import com.warehouse.inventory.entity.InventoryLog.MovementType;
import com.warehouse.inventory.exception.ResourceNotFoundException;
import com.warehouse.inventory.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Creates purchase orders and increases stock automatically.
 */
@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryLogRepository inventoryLogRepository;

    @Transactional
    public PurchaseResponse create(PurchaseRequest req) {
        Supplier supplier = null;
        if (req.supplierId() != null) {
            supplier = supplierRepository.findById(req.supplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + req.supplierId()));
        }

        Purchase purchase = Purchase.builder()
                .referenceNo("PO-" + System.currentTimeMillis())
                .supplier(supplier)
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        List<PurchaseItem> items = new ArrayList<>();

        for (LineItemRequest line : req.items()) {
            Product product = productRepository.findById(line.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + line.productId()));

            BigDecimal subtotal = line.unitPrice().multiply(BigDecimal.valueOf(line.quantity()));
            total = total.add(subtotal);

            items.add(PurchaseItem.builder()
                    .purchase(purchase)
                    .product(product)
                    .quantity(line.quantity())
                    .unitPrice(line.unitPrice())
                    .subtotal(subtotal)
                    .build());

            // Increase stock and log the movement.
            product.setQuantity(product.getQuantity() + line.quantity());
            productRepository.save(product);
            inventoryLogRepository.save(InventoryLog.builder()
                    .product(product)
                    .type(MovementType.STOCK_IN)
                    .quantity(line.quantity())
                    .note("Purchase " + purchase.getReferenceNo())
                    .build());
        }

        purchase.setItems(items);
        purchase.setTotalAmount(total);
        return toResponse(purchaseRepository.save(purchase));
    }

    public Page<PurchaseResponse> list(Pageable pageable) {
        return purchaseRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::toResponse);
    }

    public PurchaseResponse get(Long id) {
        return toResponse(purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found: " + id)));
    }

    public List<PurchaseResponse> recent() {
        return purchaseRepository.findTop5ByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    private PurchaseResponse toResponse(Purchase p) {
        List<LineItemResponse> items = p.getItems().stream()
                .map(i -> new LineItemResponse(
                        i.getProduct().getId(), i.getProduct().getName(),
                        i.getQuantity(), i.getUnitPrice(), i.getSubtotal()))
                .toList();
        return new PurchaseResponse(
                p.getId(), p.getReferenceNo(),
                p.getSupplier() != null ? p.getSupplier().getId() : null,
                p.getSupplier() != null ? p.getSupplier().getName() : null,
                p.getTotalAmount(), items, p.getCreatedAt());
    }
}
