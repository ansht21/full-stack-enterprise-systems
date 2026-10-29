package com.warehouse.repository;

import com.warehouse.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByNameContainingIgnoreCase(String name);
    boolean existsByName(String name);

    @Query("SELECT c FROM Category c WHERE c.active = true")
    List<Category> findAllActive();
}
