package com.warehouse.controller;

import com.warehouse.entity.InventoryLog;
import com.warehouse.repository.InventoryLogRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Inventory", description = "Inventory logs and stock management")
public class InventoryController {

    private final InventoryLogRepository inventoryLogRepository;

    public InventoryController(InventoryLogRepository inventoryLogRepository) {
        this.inventoryLogRepository = inventoryLogRepository;
    }

    @GetMapping
    @Operation(summary = "Get inventory logs with pagination")
    public ResponseEntity<Page<InventoryLog>> getInventoryLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(inventoryLogRepository.findAllByOrderByCreatedAtDesc(pageable));
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get inventory logs for a specific product")
    public ResponseEntity<List<InventoryLog>> getProductLogs(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryLogRepository.findByProductId(productId));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get inventory logs by type (STOCK_IN / STOCK_OUT)")
    public ResponseEntity<List<InventoryLog>> getLogsByType(@PathVariable String type) {
        return ResponseEntity.ok(inventoryLogRepository.findByType(type));
    }
}
