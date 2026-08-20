package com.warehouse.inventory.controller;

import com.warehouse.inventory.dto.ProductDtos.ProductResponse;
import com.warehouse.inventory.dto.TransactionDtos.PurchaseResponse;
import com.warehouse.inventory.dto.TransactionDtos.SaleResponse;
import com.warehouse.inventory.service.ProductService;
import com.warehouse.inventory.service.PurchaseService;
import com.warehouse.inventory.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Read-only reporting endpoints backed by the existing services.
 */
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ProductService productService;
    private final PurchaseService purchaseService;
    private final SaleService saleService;

    @GetMapping("/products")
    public Page<ProductResponse> productReport(@PageableDefault(size = 100) Pageable pageable) {
        return productService.list(null, pageable);
    }

    @GetMapping("/purchases")
    public Page<PurchaseResponse> purchaseReport(@PageableDefault(size = 100) Pageable pageable) {
        return purchaseService.list(pageable);
    }

    @GetMapping("/sales")
    public Page<SaleResponse> salesReport(@PageableDefault(size = 100) Pageable pageable) {
        return saleService.list(pageable);
    }
}
