package com.warehouse.controller;

import com.warehouse.dto.AiForecastDTO;
import com.warehouse.dto.AiWarehouseSummaryDTO;
import com.warehouse.service.AiAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "AI & Predictive Analytics", description = "AI-assisted demand forecasting, dynamic reorder points, and automated warehouse intelligence")
public class AiAnalyticsController {

    private final AiAnalyticsService aiAnalyticsService;

    public AiAnalyticsController(AiAnalyticsService aiAnalyticsService) {
        this.aiAnalyticsService = aiAnalyticsService;
    }

    @GetMapping("/forecast")
    @Operation(summary = "Get predictive demand forecasts and risk levels for all active SKUs")
    public ResponseEntity<List<AiForecastDTO>> getDemandForecasts() {
        return ResponseEntity.ok(aiAnalyticsService.calculateDemandForecasts());
    }

    @GetMapping("/forecast/{productId}")
    @Operation(summary = "Get predictive demand forecast for a single SKU by product ID")
    public ResponseEntity<AiForecastDTO> getProductForecast(@PathVariable Long productId) {
        return ResponseEntity.ok(aiAnalyticsService.getForecastByProductId(productId));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get executive AI intelligence digest and warehouse supply chain health")
    public ResponseEntity<AiWarehouseSummaryDTO> getWarehouseIntelligenceSummary() {
        return ResponseEntity.ok(aiAnalyticsService.getWarehouseIntelligenceSummary());
    }
}
