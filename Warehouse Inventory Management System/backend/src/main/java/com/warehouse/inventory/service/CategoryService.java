package com.warehouse.inventory.service;

import com.warehouse.inventory.dto.CategoryDtos.CategoryRequest;
import com.warehouse.inventory.dto.CategoryDtos.CategoryResponse;
import com.warehouse.inventory.entity.Category;
import com.warehouse.inventory.exception.ResourceNotFoundException;
import com.warehouse.inventory.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Page<CategoryResponse> list(String search, Pageable pageable) {
        Page<Category> page = (search == null || search.isBlank())
                ? categoryRepository.findAll(pageable)
                : categoryRepository.findByNameContainingIgnoreCase(search, pageable);
        return page.map(this::toResponse);
    }

    public CategoryResponse get(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        Category category = Category.builder()
                .name(req.name())
                .description(req.description())
                .build();
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest req) {
        Category category = findById(id);
        category.setName(req.name());
        category.setDescription(req.description());
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        Category category = findById(id);
        categoryRepository.delete(category);
    }

    private Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    private CategoryResponse toResponse(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getDescription());
    }
}
