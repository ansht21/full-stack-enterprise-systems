package com.warehouse.inventory.service;

import com.warehouse.inventory.dto.TransactionDtos.*;
import com.warehouse.inventory.entity.*;
import com.warehouse.inventory.entity.InventoryLog.MovementType;
import com.warehouse.inventory.exception.BadRequestException;
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
 * Creates sales (invoices) and reduces stock automatically.
 */
@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final InventoryLogRepository inventoryLogRepository;

    @Transactional
    public SaleResponse create(SaleRequest req) {
        Sale sale = Sale.builder()
                .invoiceNo("INV-" + System.currentTimeMillis())
                .customerName(req.customerName())
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        List<SaleItem> items = new ArrayList<>();

        for (LineItemRequest line : req.items()) {
            Product product = productRepository.findById(line.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + line.productId()));

            if (product.getQuantity() < line.quantity()) {
                throw new BadRequestException("Not enough stock for '" + product.getName()
                        + "'. Available: " + product.getQuantity() + ", requested: " + line.quantity());
            }

            BigDecimal subtotal = line.unitPrice().multiply(BigDecimal.valueOf(line.quantity()));
            total = total.add(subtotal);

            items.add(SaleItem.builder()
                    .sale(sale)
                    .product(product)
                    .quantity(line.quantity())
                    .unitPrice(line.unitPrice())
                    .subtotal(subtotal)
                    .build());

            // Reduce stock and log the movement.
            product.setQuantity(product.getQuantity() - line.quantity());
            productRepository.save(product);
            inventoryLogRepository.save(InventoryLog.builder()
                    .product(product)
                    .type(MovementType.STOCK_OUT)
                    .quantity(line.quantity())
                    .note("Sale " + sale.getInvoiceNo())
                    .build());
        }

        sale.setItems(items);
        sale.setTotalAmount(total);
        return toResponse(saleRepository.save(sale));
    }

    public Page<SaleResponse> list(Pageable pageable) {
        return saleRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::toResponse);
    }

    public SaleResponse get(Long id) {
        return toResponse(saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found: " + id)));
    }

    public List<SaleResponse> recent() {
        return saleRepository.findTop5ByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    private SaleResponse toResponse(Sale s) {
        List<LineItemResponse> items = s.getItems().stream()
                .map(i -> new LineItemResponse(
                        i.getProduct().getId(), i.getProduct().getName(),
                        i.getQuantity(), i.getUnitPrice(), i.getSubtotal()))
                .toList();
        return new SaleResponse(
                s.getId(), s.getInvoiceNo(), s.getCustomerName(),
                s.getTotalAmount(), items, s.getCreatedAt());
    }
}
