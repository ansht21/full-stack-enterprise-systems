package com.warehouse.service;

import com.warehouse.entity.Product;
import com.warehouse.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {
    Page<Product> getAllProducts(Pageable pageable);
    List<Product> searchProducts(String keyword);
    Product getProductById(Long id);
    Product createProduct(ProductDTO dto);
    Product updateProduct(Long id, ProductDTO dto);
    void deleteProduct(Long id);
    List<Product> getLowStockProducts();
}
