package com.warehouse.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class AiWarehouseSummaryDTO {

    private Long totalTrackedSkus;
    private Long totalStockUnits;
    private BigDecimal totalInventoryValue;
    private Long criticalStockoutRiskCount;
    private Long warningReorderCount;
    private Long optimalStockCount;
    private Long overstockedCount;
    private Double averageDailyBurnRateUnits;
    private List<AiForecastDTO> topStockoutRisks = new ArrayList<>();
    private List<String> executiveInsights = new ArrayList<>();

    public AiWarehouseSummaryDTO() {}

    public Long getTotalTrackedSkus() { return totalTrackedSkus; }
    public void setTotalTrackedSkus(Long totalTrackedSkus) { this.totalTrackedSkus = totalTrackedSkus; }

    public Long getTotalStockUnits() { return totalStockUnits; }
    public void setTotalStockUnits(Long totalStockUnits) { this.totalStockUnits = totalStockUnits; }

    public BigDecimal getTotalInventoryValue() { return totalInventoryValue; }
    public void setTotalInventoryValue(BigDecimal totalInventoryValue) { this.totalInventoryValue = totalInventoryValue; }

    public Long getCriticalStockoutRiskCount() { return criticalStockoutRiskCount; }
    public void setCriticalStockoutRiskCount(Long criticalStockoutRiskCount) { this.criticalStockoutRiskCount = criticalStockoutRiskCount; }

    public Long getWarningReorderCount() { return warningReorderCount; }
    public void setWarningReorderCount(Long warningReorderCount) { this.warningReorderCount = warningReorderCount; }

    public Long getOptimalStockCount() { return optimalStockCount; }
    public void setOptimalStockCount(Long optimalStockCount) { this.optimalStockCount = optimalStockCount; }

    public Long getOverstockedCount() { return overstockedCount; }
    public void setOverstockedCount(Long overstockedCount) { this.overstockedCount = overstockedCount; }

    public Double getAverageDailyBurnRateUnits() { return averageDailyBurnRateUnits; }
    public void setAverageDailyBurnRateUnits(Double averageDailyBurnRateUnits) { this.averageDailyBurnRateUnits = averageDailyBurnRateUnits; }

    public List<AiForecastDTO> getTopStockoutRisks() { return topStockoutRisks; }
    public void setTopStockoutRisks(List<AiForecastDTO> topStockoutRisks) { this.topStockoutRisks = topStockoutRisks; }

    public List<String> getExecutiveInsights() { return executiveInsights; }
    public void setExecutiveInsights(List<String> executiveInsights) { this.executiveInsights = executiveInsights; }
}
