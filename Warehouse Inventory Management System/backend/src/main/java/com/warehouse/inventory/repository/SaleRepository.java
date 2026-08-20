package com.warehouse.inventory.repository;

import com.warehouse.inventory.entity.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findTop5ByOrderByCreatedAtDesc();
    Page<Sale> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
