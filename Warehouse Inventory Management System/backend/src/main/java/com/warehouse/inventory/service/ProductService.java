package com.warehouse.inventory.service;

import com.warehouse.inventory.dto.ProductDtos.ProductRequest;
import com.warehouse.inventory.dto.ProductDtos.ProductResponse;
import com.warehouse.inventory.entity.Category;
import com.warehouse.inventory.entity.Product;
import com.warehouse.inventory.entity.Supplier;
import com.warehouse.inventory.exception.BadRequestException;
import com.warehouse.inventory.exception.ResourceNotFoundException;
import com.warehouse.inventory.repository.CategoryRepository;
import com.warehouse.inventory.repository.ProductRepository;
import com.warehouse.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    public Page<ProductResponse> list(String search, Pageable pageable) {
        Page<Product> page = (search == null || search.isBlank())
                ? productRepository.findAll(pageable)
                : productRepository.findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(search, search, pageable);
        return page.map(this::toResponse);
    }

    public ProductResponse get(Long id) {
        return toResponse(findById(id));
    }

    public List<ProductResponse> lowStock() {
        return productRepository.findLowStock().stream().map(this::toResponse).toList();
    }

    @Transactional
    public ProductResponse create(ProductRequest req) {
        if (productRepository.existsBySku(req.sku())) {
            throw new BadRequestException("A product with SKU '" + req.sku() + "' already exists");
        }
        Product product = Product.builder()
                .name(req.name())
                .sku(req.sku())
                .price(req.price())
                .quantity(req.quantity())
                .lowStockThreshold(req.lowStockThreshold() != null ? req.lowStockThreshold() : 10)
                .imageUrl(req.imageUrl())
                .category(resolveCategory(req.categoryId()))
                .supplier(resolveSupplier(req.supplierId()))
                .build();
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest req) {
        Product product = findById(id);
        if (!product.getSku().equals(req.sku()) && productRepository.existsBySku(req.sku())) {
            throw new BadRequestException("A product with SKU '" + req.sku() + "' already exists");
        }
        product.setName(req.name());
        product.setSku(req.sku());
        product.setPrice(req.price());
        product.setQuantity(req.quantity());
        if (req.lowStockThreshold() != null) {
            product.setLowStockThreshold(req.lowStockThreshold());
        }
        product.setImageUrl(req.imageUrl());
        product.setCategory(resolveCategory(req.categoryId()));
        product.setSupplier(resolveSupplier(req.supplierId()));
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        productRepository.delete(findById(id));
    }

    private Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    private Category resolveCategory(Long id) {
        if (id == null) return null;
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    private Supplier resolveSupplier(Long id) {
        if (id == null) return null;
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + id));
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(), p.getName(), p.getSku(), p.getPrice(), p.getQuantity(),
                p.getLowStockThreshold(), p.getImageUrl(),
                p.getCategory() != null ? p.getCategory().getId() : null,
                p.getCategory() != null ? p.getCategory().getName() : null,
                p.getSupplier() != null ? p.getSupplier().getId() : null,
                p.getSupplier() != null ? p.getSupplier().getName() : null,
                p.getQuantity() <= p.getLowStockThreshold());
    }
}
