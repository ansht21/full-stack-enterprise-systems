package com.warehouse.inventory.service;

import com.warehouse.inventory.dto.DashboardDtos.DashboardSummary;
import com.warehouse.inventory.repository.CategoryRepository;
import com.warehouse.inventory.repository.ProductRepository;
import com.warehouse.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Aggregates counts and recent activity for the dashboard.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final PurchaseService purchaseService;
    private final SaleService saleService;

    public DashboardSummary summary() {
        long lowStock = productRepository.findLowStock().size();
        return new DashboardSummary(
                productRepository.count(),
                categoryRepository.count(),
                supplierRepository.count(),
                lowStock,
                purchaseService.recent(),
                saleService.recent());
    }
}
