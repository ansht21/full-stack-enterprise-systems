package com.warehouse.service;

import com.warehouse.dto.ProductDTO;
import com.warehouse.entity.Category;
import com.warehouse.entity.Product;
import com.warehouse.entity.Supplier;
import com.warehouse.exception.BadRequestException;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.CategoryRepository;
import com.warehouse.repository.ProductRepository;
import com.warehouse.repository.SupplierRepository;
import com.warehouse.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Category testCategory;
    private Supplier testSupplier;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Electronics");

        testSupplier = new Supplier();
        testSupplier.setId(1L);
        testSupplier.setName("Global Tech Supplies");

        testProduct = new Product();
        testProduct.setId(10L);
        testProduct.setSku("ELE-12345678");
        testProduct.setName("Wireless Barcode Scanner");
        testProduct.setPrice(new BigDecimal("149.50"));
        testProduct.setQuantity(25);
        testProduct.setMinStockLevel(5);
        testProduct.setCategory(testCategory);
        testProduct.setSupplier(testSupplier);
    }

    @Test
    @DisplayName("createProduct successfully persists product with generated SKU and relations")
    void createProduct_success() {
        ProductDTO dto = new ProductDTO();
        dto.setName("Barcode Scanner");
        dto.setDescription("Handheld 2D Scanner");
        dto.setPrice(new BigDecimal("129.99"));
        dto.setQuantity(50);
        dto.setMinStockLevel(10);
        dto.setCategoryId(1L);
        dto.setSupplierId(1L);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(testSupplier));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> {
            Product saved = inv.getArgument(0);
            saved.setId(100L);
            return saved;
        });

        Product created = productService.createProduct(dto);

        assertThat(created).isNotNull();
        assertThat(created.getId()).isEqualTo(100L);
        assertThat(created.getName()).isEqualTo("Barcode Scanner");
        assertThat(created.getSku()).startsWith("BAR-");
        assertThat(created.getCategory()).isEqualTo(testCategory);
        assertThat(created.getSupplier()).isEqualTo(testSupplier);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("createProduct throws BadRequestException when category is invalid")
    void createProduct_categoryNotFound_throwsBadRequest() {
        ProductDTO dto = new ProductDTO();
        dto.setName("Barcode Scanner");
        dto.setPrice(new BigDecimal("129.99"));
        dto.setCategoryId(999L);

        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.createProduct(dto))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Category not found");

        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("getProductById returns product when found")
    void getProductById_found() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(testProduct));

        Product product = productService.getProductById(10L);

        assertThat(product).isNotNull();
        assertThat(product.getId()).isEqualTo(10L);
        assertThat(product.getSku()).isEqualTo("ELE-12345678");
    }

    @Test
    @DisplayName("getProductById throws ResourceNotFoundException when product does not exist")
    void getProductById_notFound_throwsException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Product not found with id: 999");
    }

    @Test
    @DisplayName("deleteProduct soft-deletes product by setting active flag to false")
    void deleteProduct_softDeletes() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(testProduct));

        productService.deleteProduct(10L);

        assertThat(testProduct.isActive()).isFalse();
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    @DisplayName("getLowStockProducts returns items with stock below minStockLevel")
    void getLowStockProducts_returnsList() {
        when(productRepository.findLowStockProducts()).thenReturn(Collections.singletonList(testProduct));

        List<Product> lowStock = productService.getLowStockProducts();

        assertThat(lowStock).hasSize(1);
        assertThat(lowStock.get(0).getName()).isEqualTo("Wireless Barcode Scanner");
    }
}
