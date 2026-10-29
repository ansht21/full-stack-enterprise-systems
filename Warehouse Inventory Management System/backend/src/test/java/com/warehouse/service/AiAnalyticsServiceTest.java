package com.warehouse.service;

import com.warehouse.dto.AiForecastDTO;
import com.warehouse.dto.AiWarehouseSummaryDTO;
import com.warehouse.entity.Category;
import com.warehouse.entity.InventoryLog;
import com.warehouse.entity.Product;
import com.warehouse.repository.InventoryLogRepository;
import com.warehouse.repository.ProductRepository;
import com.warehouse.service.impl.AiAnalyticsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiAnalyticsServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private InventoryLogRepository inventoryLogRepository;

    @InjectMocks
    private AiAnalyticsServiceImpl aiAnalyticsService;

    private Product criticalProduct;
    private Product optimalProduct;
    private Category hardwareCategory;

    @BeforeEach
    void setUp() {
        hardwareCategory = new Category();
        hardwareCategory.setId(1L);
        hardwareCategory.setName("Hardware");

        criticalProduct = new Product();
        criticalProduct.setId(1L);
        criticalProduct.setSku("HDW-001");
        criticalProduct.setName("Heavy Duty Bolt");
        criticalProduct.setPrice(new BigDecimal("12.50"));
        criticalProduct.setQuantity(2);
        criticalProduct.setMinStockLevel(20);
        criticalProduct.setCategory(hardwareCategory);
        criticalProduct.setActive(true);

        optimalProduct = new Product();
        optimalProduct.setId(2L);
        optimalProduct.setSku("HDW-002");
        optimalProduct.setName("Steel Anchor");
        optimalProduct.setPrice(new BigDecimal("25.00"));
        optimalProduct.setQuantity(30);
        optimalProduct.setMinStockLevel(15);
        optimalProduct.setCategory(hardwareCategory);
        optimalProduct.setActive(true);
    }

    @Test
    @DisplayName("calculateDemandForecasts accurately detects CRITICAL stockout risk on depleted stock")
    void calculateDemandForecasts_criticalRisk() {
        // Mock recent stock-out transactions
        InventoryLog log1 = new InventoryLog();
        log1.setType("STOCK_OUT");
        log1.setQuantity(30);
        log1.setCreatedAt(LocalDateTime.now().minusDays(5));

        when(productRepository.findByActiveTrue()).thenReturn(Collections.singletonList(criticalProduct));
        when(inventoryLogRepository.findByProductId(1L)).thenReturn(Collections.singletonList(log1));

        List<AiForecastDTO> forecasts = aiAnalyticsService.calculateDemandForecasts();

        assertThat(forecasts).hasSize(1);
        AiForecastDTO forecast = forecasts.get(0);
        assertThat(forecast.getProductId()).isEqualTo(1L);
        assertThat(forecast.getAvgDailyConsumption()).isEqualTo(1.0); // 30 units / 30 days
        assertThat(forecast.getRiskLevel()).isEqualTo("CRITICAL");
        assertThat(forecast.getDaysUntilStockout()).isEqualTo(2); // 2 units / 1.0 per day
        assertThat(forecast.getRecommendationMessage()).contains("CRITICAL");
    }

    @Test
    @DisplayName("calculateDemandForecasts handles zero transaction history safely without divide-by-zero")
    void calculateDemandForecasts_zeroConsumptionSafety() {
        when(productRepository.findByActiveTrue()).thenReturn(Collections.singletonList(optimalProduct));
        when(inventoryLogRepository.findByProductId(2L)).thenReturn(Collections.emptyList());

        List<AiForecastDTO> forecasts = aiAnalyticsService.calculateDemandForecasts();

        assertThat(forecasts).hasSize(1);
        AiForecastDTO forecast = forecasts.get(0);
        assertThat(forecast.getAvgDailyConsumption()).isGreaterThan(0.0);
        assertThat(forecast.getDaysUntilStockout()).isNotNull();
        assertThat(forecast.getRiskLevel()).isEqualTo("OPTIMAL");
    }

    @Test
    @DisplayName("getWarehouseIntelligenceSummary generates correct aggregate metrics and executive insights")
    void getWarehouseIntelligenceSummary_synthesizesCorrectMetrics() {
        when(productRepository.findByActiveTrue()).thenReturn(Arrays.asList(criticalProduct, optimalProduct));
        when(productRepository.findById(1L)).thenReturn(java.util.Optional.of(criticalProduct));
        when(productRepository.findById(2L)).thenReturn(java.util.Optional.of(optimalProduct));

        when(inventoryLogRepository.findByProductId(1L)).thenReturn(Collections.emptyList());
        when(inventoryLogRepository.findByProductId(2L)).thenReturn(Collections.emptyList());

        AiWarehouseSummaryDTO summary = aiAnalyticsService.getWarehouseIntelligenceSummary();

        assertThat(summary).isNotNull();
        assertThat(summary.getTotalTrackedSkus()).isEqualTo(2L);
        assertThat(summary.getTotalStockUnits()).isEqualTo(32L); // 2 + 30
        // Valuation: (2 * 12.50) + (30 * 25.00) = 25.00 + 750.00 = 775.00
        assertThat(summary.getTotalInventoryValue()).isEqualByComparingTo(new BigDecimal("775.00"));
        assertThat(summary.getExecutiveInsights()).isNotEmpty();
        assertThat(summary.getCriticalStockoutRiskCount()).isGreaterThanOrEqualTo(1L);
    }
}
