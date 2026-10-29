package com.warehouse.service;

import com.warehouse.dto.AiForecastDTO;
import com.warehouse.dto.AiWarehouseSummaryDTO;

import java.util.List;

public interface AiAnalyticsService {

    /**
     * Computes predictive demand forecasts, dynamic reorder points (ROP),
     * and stockout risk levels across all active inventory items.
     */
    List<AiForecastDTO> calculateDemandForecasts();

    /**
     * Computes demand forecast and reorder metrics for a specific product.
     */
    AiForecastDTO getForecastByProductId(Long productId);

    /**
     * Synthesizes warehouse-wide inventory telemetry into an executive
     * intelligence digest with actionable replenishment recommendations.
     */
    AiWarehouseSummaryDTO getWarehouseIntelligenceSummary();
}
