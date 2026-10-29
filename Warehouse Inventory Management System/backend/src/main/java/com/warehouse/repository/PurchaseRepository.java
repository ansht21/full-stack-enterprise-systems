package com.warehouse.repository;

import com.warehouse.entity.Purchase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    Optional<Purchase> findByPurchaseNumber(String purchaseNumber);
    Page<Purchase> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT p FROM Purchase p WHERE p.purchaseDate BETWEEN :start AND :end ORDER BY p.createdAt DESC")
    List<Purchase> findByDateRange(LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(p.totalAmount), 0) FROM Purchase p")
    java.math.BigDecimal sumAllPurchaseAmount();

    @Query("SELECT COUNT(p) FROM Purchase p")
    long countAll();
}
