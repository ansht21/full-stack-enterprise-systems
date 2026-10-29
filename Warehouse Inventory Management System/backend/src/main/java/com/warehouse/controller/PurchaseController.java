package com.warehouse.controller;

import com.warehouse.dto.PurchaseDTO;
import com.warehouse.entity.Purchase;
import com.warehouse.service.PurchaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Purchases", description = "Purchase management")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping
    @Operation(summary = "Get all purchases with pagination")
    public ResponseEntity<Page<Purchase>> getAllPurchases(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(purchaseService.getAllPurchases(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get purchase by ID")
    public ResponseEntity<Purchase> getPurchaseById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseService.getPurchaseById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new purchase (auto-updates stock)")
    public ResponseEntity<Purchase> createPurchase(@Valid @RequestBody PurchaseDTO dto) {
        return ResponseEntity.ok(purchaseService.createPurchase(dto));
    }
}
