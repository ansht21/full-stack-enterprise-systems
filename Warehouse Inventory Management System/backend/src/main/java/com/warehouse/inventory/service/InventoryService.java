package com.warehouse.inventory.service;

import com.warehouse.inventory.dto.InventoryDtos.InventoryLogResponse;
import com.warehouse.inventory.dto.InventoryDtos.StockAdjustRequest;
import com.warehouse.inventory.entity.InventoryLog;
import com.warehouse.inventory.entity.InventoryLog.MovementType;
import com.warehouse.inventory.entity.Product;
import com.warehouse.inventory.exception.BadRequestException;
import com.warehouse.inventory.exception.ResourceNotFoundException;
import com.warehouse.inventory.repository.InventoryLogRepository;
import com.warehouse.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles manual stock adjustments and keeps an audit trail in inventory_logs.
 */
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductRepository productRepository;
    private final InventoryLogRepository inventoryLogRepository;

    @Transactional
    public InventoryLogResponse stockIn(StockAdjustRequest req) {
        Product product = findProduct(req.productId());
        product.setQuantity(product.getQuantity() + req.quantity());
        productRepository.save(product);
        return toResponse(log(product, MovementType.STOCK_IN, req.quantity(), req.note()));
    }

    @Transactional
    public InventoryLogResponse stockOut(StockAdjustRequest req) {
        Product product = findProduct(req.productId());
        if (product.getQuantity() < req.quantity()) {
            throw new BadRequestException("Not enough stock for '" + product.getName()
                    + "'. Available: " + product.getQuantity());
        }
        product.setQuantity(product.getQuantity() - req.quantity());
        productRepository.save(product);
        return toResponse(log(product, MovementType.STOCK_OUT, req.quantity(), req.note()));
    }

    public Page<InventoryLogResponse> history(Long productId, Pageable pageable) {
        Page<InventoryLog> page = (productId == null)
                ? inventoryLogRepository.findAllByOrderByCreatedAtDesc(pageable)
                : inventoryLogRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
        return page.map(this::toResponse);
    }

    private InventoryLog log(Product product, MovementType type, int qty, String note) {
        return inventoryLogRepository.save(InventoryLog.builder()
                .product(product)
                .type(type)
                .quantity(qty)
                .note(note)
                .build());
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    private InventoryLogResponse toResponse(InventoryLog l) {
        return new InventoryLogResponse(
                l.getId(), l.getProduct().getId(), l.getProduct().getName(),
                l.getType().name(), l.getQuantity(), l.getNote(), l.getCreatedAt());
    }
}
