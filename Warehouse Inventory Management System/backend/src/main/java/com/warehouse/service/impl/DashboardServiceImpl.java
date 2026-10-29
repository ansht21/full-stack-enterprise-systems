package com.warehouse.service.impl;

import com.warehouse.dto.DashboardDTO;
import com.warehouse.entity.Purchase;
import com.warehouse.entity.Sale;
import com.warehouse.repository.*;
import com.warehouse.service.DashboardService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final PurchaseRepository purchaseRepository;
    private final SaleRepository saleRepository;

    public DashboardServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository,
                                SupplierRepository supplierRepository, PurchaseRepository purchaseRepository,
                                SaleRepository saleRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.purchaseRepository = purchaseRepository;
        this.saleRepository = saleRepository;
    }

    @Override
    public DashboardDTO getDashboardData() {
        DashboardDTO dto = new DashboardDTO();
        dto.setTotalProducts(productRepository.countActive());
        dto.setTotalCategories(categoryRepository.count());
        dto.setTotalSuppliers(supplierRepository.count());
        dto.setLowStockItems(productRepository.findLowStockProducts().size());
        dto.setTotalPurchases(purchaseRepository.countAll());
        dto.setTotalSales(saleRepository.countAll());
        dto.setTotalPurchaseAmount(purchaseRepository.sumAllPurchaseAmount());
        dto.setTotalSaleAmount(saleRepository.sumAllSaleAmount());

        List<Purchase> recentPurchases = purchaseRepository.findAll().stream()
                .limit(5).collect(Collectors.toList());
        dto.setRecentPurchases(recentPurchases.stream().map(p -> {
            DashboardDTO.RecentTransaction t = new DashboardDTO.RecentTransaction();
            t.setId(p.getId());
            t.setNumber(p.getPurchaseNumber());
            t.setParty(p.getSupplier().getName());
            t.setAmount(p.getTotalAmount());
            t.setDate(p.getPurchaseDate());
            return t;
        }).collect(Collectors.toList()));

        List<Sale> recentSales = saleRepository.findAll().stream()
                .limit(5).collect(Collectors.toList());
        dto.setRecentSales(recentSales.stream().map(s -> {
            DashboardDTO.RecentTransaction t = new DashboardDTO.RecentTransaction();
            t.setId(s.getId());
            t.setNumber(s.getSaleNumber());
            t.setParty(s.getCustomerName());
            t.setAmount(s.getTotalAmount());
            t.setDate(s.getSaleDate());
            return t;
        }).collect(Collectors.toList()));

        return dto;
    }
}
