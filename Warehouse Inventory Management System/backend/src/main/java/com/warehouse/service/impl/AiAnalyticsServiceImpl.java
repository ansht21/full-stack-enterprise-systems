package com.warehouse.service.impl;

import com.warehouse.dto.AiForecastDTO;
import com.warehouse.dto.AiWarehouseSummaryDTO;
import com.warehouse.entity.InventoryLog;
import com.warehouse.entity.Product;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.InventoryLogRepository;
import com.warehouse.repository.ProductRepository;
import com.warehouse.service.AiAnalyticsService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiAnalyticsServiceImpl implements AiAnalyticsService {

    private final ProductRepository productRepository;
    private final InventoryLogRepository inventoryLogRepository;

    private static final int DEFAULT_LEAD_TIME_DAYS = 5;

    public AiAnalyticsServiceImpl(ProductRepository productRepository,
                                  InventoryLogRepository inventoryLogRepository) {
        this.productRepository = productRepository;
        this.inventoryLogRepository = inventoryLogRepository;
    }

    @Override
    public List<AiForecastDTO> calculateDemandForecasts() {
        List<Product> activeProducts = productRepository.findByActiveTrue();
        return activeProducts.stream()
                .map(this::computeForecastForProduct)
                .sorted(Comparator.comparingInt(f -> f.getDaysUntilStockout() != null ? f.getDaysUntilStockout() : Integer.MAX_VALUE))
                .collect(Collectors.toList());
    }

    @Override
    public AiForecastDTO getForecastByProductId(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        return computeForecastForProduct(product);
    }

    @Override
    public AiWarehouseSummaryDTO getWarehouseIntelligenceSummary() {
        List<AiForecastDTO> forecasts = calculateDemandForecasts();

        long totalSkus = forecasts.size();
        long totalUnits = 0;
        BigDecimal totalValue = BigDecimal.ZERO;
        long criticalCount = 0;
        long warningCount = 0;
        long optimalCount = 0;
        long overstockedCount = 0;
        double totalBurnRate = 0.0;

        for (AiForecastDTO f : forecasts) {
            totalUnits += f.getCurrentStock();
            totalBurnRate += f.getAvgDailyConsumption();

            Product p = productRepository.findById(f.getProductId()).orElse(null);
            if (p != null && p.getPrice() != null) {
                BigDecimal itemValuation = p.getPrice().multiply(BigDecimal.valueOf(Math.max(0, p.getQuantity())));
                totalValue = totalValue.add(itemValuation);
            }

            switch (f.getRiskLevel()) {
                case "CRITICAL":
                    criticalCount++;
                    break;
                case "WARNING":
                    warningCount++;
                    break;
                case "OVERSTOCKED":
                    overstockedCount++;
                    break;
                default:
                    optimalCount++;
                    break;
            }
        }

        AiWarehouseSummaryDTO summary = new AiWarehouseSummaryDTO();
        summary.setTotalTrackedSkus(totalSkus);
        summary.setTotalStockUnits(totalUnits);
        summary.setTotalInventoryValue(totalValue.setScale(2, RoundingMode.HALF_UP));
        summary.setCriticalStockoutRiskCount(criticalCount);
        summary.setWarningReorderCount(warningCount);
        summary.setOptimalStockCount(optimalCount);
        summary.setOverstockedCount(overstockedCount);
        summary.setAverageDailyBurnRateUnits(Math.round(totalBurnRate * 100.0) / 100.0);

        // Top 5 most urgent stockout risks
        List<AiForecastDTO> topRisks = forecasts.stream()
                .filter(f -> "CRITICAL".equals(f.getRiskLevel()) || "WARNING".equals(f.getRiskLevel()))
                .limit(5)
                .collect(Collectors.toList());
        summary.setTopStockoutRisks(topRisks);

        // Natural Language Executive Insights
        List<String> insights = new ArrayList<>();
        if (criticalCount > 0) {
            insights.add(String.format("URGENT: %d SKU(s) facing imminent stockout within 3 days. Immediate purchase orders required to prevent fulfillment failure.", criticalCount));
        }
        if (warningCount > 0) {
            insights.add(String.format("REORDER ALERT: %d SKU(s) have breached their safety Reorder Point (ROP). Trigger supplier replenishment factoring in %d-day lead time.", warningCount, DEFAULT_LEAD_TIME_DAYS));
        }
        if (overstockedCount > 0) {
            insights.add(String.format("CAPITAL EFFICIENCY: %d SKU(s) identified as overstocked. Estimated inventory holding cost can be optimized by adjusting restock batch sizes.", overstockedCount));
        }
        if (criticalCount == 0 && warningCount == 0) {
            insights.add("HEALTHY SUPPLY CHAIN: All monitored SKUs maintain optimal safety stock buffers with zero projected stockouts over the next 7 operating days.");
        }
        insights.add(String.format("TURNOVER VELOCITY: Aggregate warehouse consumption is trending at %.1f units/day across active catalog.", totalBurnRate));

        summary.setExecutiveInsights(insights);
        return summary;
    }

    private AiForecastDTO computeForecastForProduct(Product product) {
        AiForecastDTO dto = new AiForecastDTO();
        dto.setProductId(product.getId());
        dto.setSku(product.getSku());
        dto.setProductName(product.getName());
        dto.setCategoryName(product.getCategory() != null ? product.getCategory().getName() : "Unassigned");
        dto.setCurrentStock(product.getQuantity());
        dto.setMinStockLevel(product.getMinStockLevel());
        dto.setLeadTimeDays(DEFAULT_LEAD_TIME_DAYS);

        // 1. Analyze historical consumption from inventory logs (last 30 days)
        List<InventoryLog> logs = inventoryLogRepository.findByProductId(product.getId());
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

        int totalOutflow = logs.stream()
                .filter(l -> "STOCK_OUT".equalsIgnoreCase(l.getType()))
                .filter(l -> l.getCreatedAt() != null && l.getCreatedAt().isAfter(thirtyDaysAgo))
                .mapToInt(InventoryLog::getQuantity)
                .sum();

        double avgDailyConsumption;
        if (totalOutflow > 0) {
            avgDailyConsumption = totalOutflow / 30.0;
        } else {
            // Safe baseline heuristic for newly added products or low activity SKUs
            int baseLevel = product.getMinStockLevel() != null ? product.getMinStockLevel() : 10;
            avgDailyConsumption = Math.max(0.25, baseLevel / 14.0);
        }
        double roundedConsumption = Math.round(avgDailyConsumption * 100.0) / 100.0;
        dto.setAvgDailyConsumption(roundedConsumption);

        // 2. Safety Stock & Reorder Point (ROP) calculation
        int safetyStock = Math.max(product.getMinStockLevel() != null ? product.getMinStockLevel() : 5,
                (int) Math.ceil(roundedConsumption * 3));
        dto.setSafetyStock(safetyStock);

        int reorderPoint = (int) Math.ceil((roundedConsumption * DEFAULT_LEAD_TIME_DAYS) + safetyStock);
        dto.setReorderPoint(reorderPoint);

        // 3. Days until stockout
        int daysUntilStockout;
        if (product.getQuantity() <= 0) {
            daysUntilStockout = 0;
        } else if (roundedConsumption > 0) {
            daysUntilStockout = (int) Math.floor(product.getQuantity() / roundedConsumption);
        } else {
            daysUntilStockout = 999;
        }
        dto.setDaysUntilStockout(daysUntilStockout);

        // 4. Recommended reorder batch size
        int reorderQty = Math.max(safetyStock * 2, (reorderPoint * 2) - Math.max(0, product.getQuantity()));
        dto.setRecommendedReorderQuantity(reorderQty);

        // 5. Risk classification & AI recommendation message
        if (product.getQuantity() <= 0 || daysUntilStockout <= 3) {
            dto.setRiskLevel("CRITICAL");
            dto.setRecommendationMessage(String.format(
                    "CRITICAL: Immediate stockout risk! %d units remaining with ~%d days of supply. Trigger urgent purchase order of %d units.",
                    product.getQuantity(), daysUntilStockout, reorderQty));
        } else if (product.getQuantity() <= reorderPoint || daysUntilStockout <= 7) {
            dto.setRiskLevel("WARNING");
            dto.setRecommendationMessage(String.format(
                    "WARNING: Inventory has breached Reorder Point (%d units). Reorder %d units to sustain demand over %d-day lead time.",
                    reorderPoint, reorderQty, DEFAULT_LEAD_TIME_DAYS));
        } else if (product.getQuantity() > (reorderPoint * 3.5) && product.getQuantity() > 50) {
            dto.setRiskLevel("OVERSTOCKED");
            dto.setRecommendationMessage(String.format(
                    "OVERSTOCKED: Stock level (%d units) exceeds 3.5x calculated ROP. Holding surplus inventory; pause scheduled purchase orders.",
                    product.getQuantity()));
        } else {
            dto.setRiskLevel("OPTIMAL");
            dto.setRecommendationMessage(String.format(
                    "OPTIMAL: Stock level is healthy. Current inventory covers approximately %d days of projected demand.",
                    daysUntilStockout));
        }

        return dto;
    }
}
