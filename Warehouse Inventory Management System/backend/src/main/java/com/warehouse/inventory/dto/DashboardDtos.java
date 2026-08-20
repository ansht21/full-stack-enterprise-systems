package com.warehouse.inventory.dto;

import com.warehouse.inventory.dto.TransactionDtos.PurchaseResponse;
import com.warehouse.inventory.dto.TransactionDtos.SaleResponse;

import java.util.List;

public class DashboardDtos {

    public record DashboardSummary(
            long totalProducts,
            long totalCategories,
            long totalSuppliers,
            long lowStockItems,
            List<PurchaseResponse> recentPurchases,
            List<SaleResponse> recentSales) {
    }
}
