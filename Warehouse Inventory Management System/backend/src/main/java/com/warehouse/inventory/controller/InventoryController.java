package com.warehouse.inventory.controller;

import com.warehouse.inventory.dto.InventoryDtos.InventoryLogResponse;
import com.warehouse.inventory.dto.InventoryDtos.StockAdjustRequest;
import com.warehouse.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping("/stock-in")
    public InventoryLogResponse stockIn(@Valid @RequestBody StockAdjustRequest req) {
        return inventoryService.stockIn(req);
    }

    @PostMapping("/stock-out")
    public InventoryLogResponse stockOut(@Valid @RequestBody StockAdjustRequest req) {
        return inventoryService.stockOut(req);
    }

    @GetMapping("/history")
    public Page<InventoryLogResponse> history(@RequestParam(required = false) Long productId,
                                              @PageableDefault(size = 15) Pageable pageable) {
        return inventoryService.history(productId, pageable);
    }
}
