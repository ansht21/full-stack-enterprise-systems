package com.warehouse.service.impl;

import com.warehouse.dto.SaleDTO;
import com.warehouse.entity.*;
import com.warehouse.exception.BadRequestException;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.*;
import com.warehouse.service.SaleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final UserRepository userRepository;

    public SaleServiceImpl(SaleRepository saleRepository, ProductRepository productRepository,
                           InventoryLogRepository inventoryLogRepository, UserRepository userRepository) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.inventoryLogRepository = inventoryLogRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Page<Sale> getAllSales(Pageable pageable) {
        return saleRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Override
    public Sale getSaleById(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));
    }

    @Override
    @Transactional
    public Sale createSale(SaleDTO dto) {
        String currentUser = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(currentUser)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Sale sale = new Sale();
        sale.setSaleNumber("SAL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        sale.setCustomerName(dto.getCustomerName());
        sale.setCustomerPhone(dto.getCustomerPhone());
        sale.setCreatedBy(user);
        sale.setSaleDate(LocalDate.now());
        sale.setNotes(dto.getNotes());

        BigDecimal total = BigDecimal.ZERO;

        for (SaleDTO.SaleItemDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new BadRequestException("Product not found: " + itemDto.getProductId()));

            if (product.getQuantity() < itemDto.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            SaleItem item = new SaleItem(product, itemDto.getQuantity(), itemDto.getUnitPrice());
            sale.addItem(item);
            total = total.add(item.getTotalPrice());

            product.setQuantity(product.getQuantity() - itemDto.getQuantity());
            productRepository.save(product);

            inventoryLogRepository.save(new InventoryLog(product, "STOCK_OUT", itemDto.getQuantity(),
                    "SALE", null, "Stock out from sale"));
        }

        sale.setTotalAmount(total);
        return saleRepository.save(sale);
    }
}
