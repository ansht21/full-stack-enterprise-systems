package com.warehouse.repository;

import com.warehouse.entity.InventoryLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
    List<InventoryLog> findByProductId(Long productId);
    Page<InventoryLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<InventoryLog> findByType(String type);
}
