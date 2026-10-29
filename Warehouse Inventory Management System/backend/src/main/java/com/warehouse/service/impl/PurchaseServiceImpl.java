package com.warehouse.service.impl;

import com.warehouse.dto.PurchaseDTO;
import com.warehouse.entity.*;
import com.warehouse.exception.BadRequestException;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.*;
import com.warehouse.service.PurchaseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final UserRepository userRepository;

    public PurchaseServiceImpl(PurchaseRepository purchaseRepository, ProductRepository productRepository,
                               SupplierRepository supplierRepository, InventoryLogRepository inventoryLogRepository,
                               UserRepository userRepository) {
        this.purchaseRepository = purchaseRepository;
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryLogRepository = inventoryLogRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Page<Purchase> getAllPurchases(Pageable pageable) {
        return purchaseRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Override
    public Purchase getPurchaseById(Long id) {
        return purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found with id: " + id));
    }

    @Override
    @Transactional
    public Purchase createPurchase(PurchaseDTO dto) {
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new BadRequestException("Supplier not found"));

        String currentUser = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(currentUser)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Purchase purchase = new Purchase();
        purchase.setPurchaseNumber("PUR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        purchase.setSupplier(supplier);
        purchase.setCreatedBy(user);
        purchase.setPurchaseDate(LocalDate.now());
        purchase.setNotes(dto.getNotes());

        BigDecimal total = BigDecimal.ZERO;

        for (PurchaseDTO.PurchaseItemDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new BadRequestException("Product not found: " + itemDto.getProductId()));

            PurchaseItem item = new PurchaseItem(product, itemDto.getQuantity(), itemDto.getUnitPrice());
            purchase.addItem(item);
            total = total.add(item.getTotalPrice());

            product.setQuantity(product.getQuantity() + itemDto.getQuantity());
            productRepository.save(product);

            inventoryLogRepository.save(new InventoryLog(product, "STOCK_IN", itemDto.getQuantity(),
                    "PURCHASE", null, "Stock in from purchase"));
        }

        purchase.setTotalAmount(total);
        return purchaseRepository.save(purchase);
    }
}
