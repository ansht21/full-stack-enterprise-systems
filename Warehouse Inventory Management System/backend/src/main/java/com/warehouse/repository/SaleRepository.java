package com.warehouse.repository;

import com.warehouse.entity.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    Optional<Sale> findBySaleNumber(String saleNumber);
    Page<Sale> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT s FROM Sale s WHERE s.saleDate BETWEEN :start AND :end ORDER BY s.createdAt DESC")
    List<Sale> findByDateRange(LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(s.totalAmount), 0) FROM Sale s")
    java.math.BigDecimal sumAllSaleAmount();

    @Query("SELECT COUNT(s) FROM Sale s")
    long countAll();
}
