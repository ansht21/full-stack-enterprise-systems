package com.warehouse.inventory.repository;

import com.warehouse.inventory.entity.Purchase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findTop5ByOrderByCreatedAtDesc();
    Page<Purchase> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
