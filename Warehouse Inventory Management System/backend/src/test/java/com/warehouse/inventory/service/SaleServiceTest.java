package com.warehouse.inventory.service;

import com.warehouse.inventory.dto.TransactionDtos.LineItemRequest;
import com.warehouse.inventory.dto.TransactionDtos.SaleRequest;
import com.warehouse.inventory.entity.Product;
import com.warehouse.inventory.exception.BadRequestException;
import com.warehouse.inventory.repository.InventoryLogRepository;
import com.warehouse.inventory.repository.ProductRepository;
import com.warehouse.inventory.repository.SaleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the core sale logic: stock reduction and insufficient-stock guard.
 */
@ExtendWith(MockitoExtension.class)
class SaleServiceTest {

    @Mock private SaleRepository saleRepository;
    @Mock private ProductRepository productRepository;
    @Mock private InventoryLogRepository inventoryLogRepository;

    @InjectMocks private SaleService saleService;

    private Product product(int qty) {
        Product p = new Product();
        p.setId(1L);
        p.setName("Widget");
        p.setSku("SKU-1");
        p.setPrice(new BigDecimal("5.00"));
        p.setQuantity(qty);
        p.setLowStockThreshold(2);
        return p;
    }

    @Test
    void createSale_reducesStock_andSavesSale() {
        Product p = product(10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));
        when(saleRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        SaleRequest req = new SaleRequest("Alice",
                List.of(new LineItemRequest(1L, 3, new BigDecimal("5.00"))));

        var response = saleService.create(req);

        assertThat(p.getQuantity()).isEqualTo(7); // 10 - 3
        assertThat(response.totalAmount()).isEqualByComparingTo("15.00");
        verify(inventoryLogRepository, times(1)).save(any());
    }

    @Test
    void createSale_throwsWhenStockInsufficient() {
        Product p = product(2);
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        SaleRequest req = new SaleRequest("Bob",
                List.of(new LineItemRequest(1L, 5, new BigDecimal("5.00"))));

        assertThatThrownBy(() -> saleService.create(req))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Not enough stock");

        assertThat(p.getQuantity()).isEqualTo(2); // unchanged
        verify(saleRepository, never()).save(any());
    }
}
