package com.warehouse.inventory.controller;

import com.warehouse.inventory.dto.TransactionDtos.PurchaseRequest;
import com.warehouse.inventory.dto.TransactionDtos.PurchaseResponse;
import com.warehouse.inventory.service.PurchaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @GetMapping
    public Page<PurchaseResponse> list(@PageableDefault(size = 10) Pageable pageable) {
        return purchaseService.list(pageable);
    }

    @GetMapping("/{id}")
    public PurchaseResponse get(@PathVariable Long id) {
        return purchaseService.get(id);
    }

    @PostMapping
    public ResponseEntity<PurchaseResponse> create(@Valid @RequestBody PurchaseRequest req) {
        return ResponseEntity.ok(purchaseService.create(req));
    }
}
