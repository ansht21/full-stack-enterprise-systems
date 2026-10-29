package com.warehouse.service;

import com.warehouse.entity.Category;
import com.warehouse.dto.CategoryDTO;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category createCategory(CategoryDTO dto);
    Category updateCategory(Long id, CategoryDTO dto);
    void deleteCategory(Long id);
    List<Category> searchCategories(String keyword);
}
