package com.warehouse.inventory.controller;

import com.warehouse.inventory.dto.TransactionDtos.SaleRequest;
import com.warehouse.inventory.dto.TransactionDtos.SaleResponse;
import com.warehouse.inventory.service.SaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @GetMapping
    public Page<SaleResponse> list(@PageableDefault(size = 10) Pageable pageable) {
        return saleService.list(pageable);
    }

    @GetMapping("/{id}")
    public SaleResponse get(@PathVariable Long id) {
        return saleService.get(id);
    }

    @PostMapping
    public ResponseEntity<SaleResponse> create(@Valid @RequestBody SaleRequest req) {
        return ResponseEntity.ok(saleService.create(req));
    }
}
