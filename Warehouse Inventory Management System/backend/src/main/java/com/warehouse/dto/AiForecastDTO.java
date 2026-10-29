package com.warehouse.dto;

public class AiForecastDTO {

    private Long productId;
    private String sku;
    private String productName;
    private String categoryName;
    private Integer currentStock;
    private Integer minStockLevel;
    private Double avgDailyConsumption;
    private Integer leadTimeDays;
    private Integer safetyStock;
    private Integer reorderPoint;
    private Integer daysUntilStockout;
    private Integer recommendedReorderQuantity;
    private String riskLevel; // CRITICAL, WARNING, OPTIMAL, OVERSTOCKED
    private String recommendationMessage;

    public AiForecastDTO() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Integer getCurrentStock() { return currentStock; }
    public void setCurrentStock(Integer currentStock) { this.currentStock = currentStock; }

    public Integer getMinStockLevel() { return minStockLevel; }
    public void setMinStockLevel(Integer minStockLevel) { this.minStockLevel = minStockLevel; }

    public Double getAvgDailyConsumption() { return avgDailyConsumption; }
    public void setAvgDailyConsumption(Double avgDailyConsumption) { this.avgDailyConsumption = avgDailyConsumption; }

    public Integer getLeadTimeDays() { return leadTimeDays; }
    public void setLeadTimeDays(Integer leadTimeDays) { this.leadTimeDays = leadTimeDays; }

    public Integer getSafetyStock() { return safetyStock; }
    public void setSafetyStock(Integer safetyStock) { this.safetyStock = safetyStock; }

    public Integer getReorderPoint() { return reorderPoint; }
    public void setReorderPoint(Integer reorderPoint) { this.reorderPoint = reorderPoint; }

    public Integer getDaysUntilStockout() { return daysUntilStockout; }
    public void setDaysUntilStockout(Integer daysUntilStockout) { this.daysUntilStockout = daysUntilStockout; }

    public Integer getRecommendedReorderQuantity() { return recommendedReorderQuantity; }
    public void setRecommendedReorderQuantity(Integer recommendedReorderQuantity) { this.recommendedReorderQuantity = recommendedReorderQuantity; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getRecommendationMessage() { return recommendationMessage; }
    public void setRecommendationMessage(String recommendationMessage) { this.recommendationMessage = recommendationMessage; }
}
