package com.warehouse.service;

import com.warehouse.dto.SaleDTO;
import com.warehouse.entity.*;
import com.warehouse.exception.BadRequestException;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.*;
import com.warehouse.service.impl.SaleServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SaleServiceTest {

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private InventoryLogRepository inventoryLogRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SaleServiceImpl saleService;

    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("admin");
        testUser.setEmail("admin@warehouse.com");

        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setSku("PRD-001");
        testProduct.setName("Industrial Drill");
        testProduct.setPrice(new BigDecimal("99.99"));
        testProduct.setQuantity(20);
        testProduct.setMinStockLevel(5);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("admin", "password")
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("createSale reduces product stock, writes inventory log, and persists sale")
    void createSale_reducesStock_andSavesSale() {
        // Arrange
        SaleDTO.SaleItemDTO itemDTO = new SaleDTO.SaleItemDTO();
        itemDTO.setProductId(1L);
        itemDTO.setQuantity(5);
        itemDTO.setUnitPrice(new BigDecimal("99.99"));

        SaleDTO saleDTO = new SaleDTO();
        saleDTO.setCustomerName("Acme Corp");
        saleDTO.setCustomerPhone("555-0199");
        saleDTO.setItems(Collections.singletonList(itemDTO));

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(testUser));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Sale createdSale = saleService.createSale(saleDTO);

        // Assert
        assertThat(createdSale).isNotNull();
        assertThat(createdSale.getCustomerName()).isEqualTo("Acme Corp");
        assertThat(createdSale.getTotalAmount()).isEqualByComparingTo(new BigDecimal("499.95"));
        assertThat(testProduct.getQuantity()).isEqualTo(15);

        verify(productRepository, times(1)).save(testProduct);
        verify(inventoryLogRepository, times(1)).save(any(InventoryLog.class));
        verify(saleRepository, times(1)).save(any(Sale.class));
    }

    @Test
    @DisplayName("createSale throws BadRequestException when requested quantity exceeds available stock")
    void createSale_insufficientStock_throwsException() {
        // Arrange
        testProduct.setQuantity(3);

        SaleDTO.SaleItemDTO itemDTO = new SaleDTO.SaleItemDTO();
        itemDTO.setProductId(1L);
        itemDTO.setQuantity(10);
        itemDTO.setUnitPrice(new BigDecimal("99.99"));

        SaleDTO saleDTO = new SaleDTO();
        saleDTO.setCustomerName("Acme Corp");
        saleDTO.setItems(Collections.singletonList(itemDTO));

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(testUser));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // Act & Assert
        assertThatThrownBy(() -> saleService.createSale(saleDTO))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Insufficient stock for product: Industrial Drill");

        verify(saleRepository, never()).save(any());
        verify(inventoryLogRepository, never()).save(any());
    }

    @Test
    @DisplayName("createSale throws BadRequestException when product id does not exist")
    void createSale_productNotFound_throwsException() {
        // Arrange
        SaleDTO.SaleItemDTO itemDTO = new SaleDTO.SaleItemDTO();
        itemDTO.setProductId(999L);
        itemDTO.setQuantity(2);
        itemDTO.setUnitPrice(new BigDecimal("10.00"));

        SaleDTO saleDTO = new SaleDTO();
        saleDTO.setItems(Collections.singletonList(itemDTO));

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(testUser));
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> saleService.createSale(saleDTO))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Product not found: 999");

        verify(saleRepository, never()).save(any());
    }

    @Test
    @DisplayName("getSaleById returns sale when id exists")
    void getSaleById_found_returnsSale() {
        // Arrange
        Sale sale = new Sale();
        sale.setId(10L);
        sale.setSaleNumber("SAL-ABC12345");
        when(saleRepository.findById(10L)).thenReturn(Optional.of(sale));

        // Act
        Sale result = saleService.getSaleById(10L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getSaleNumber()).isEqualTo("SAL-ABC12345");
    }

    @Test
    @DisplayName("getSaleById throws ResourceNotFoundException when id does not exist")
    void getSaleById_notFound_throwsException() {
        when(saleRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> saleService.getSaleById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Sale not found with id: 99");
    }
}
