package com.warehouse.service;

import com.warehouse.dto.PurchaseDTO;
import com.warehouse.entity.Purchase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PurchaseService {
    Page<Purchase> getAllPurchases(Pageable pageable);
    Purchase getPurchaseById(Long id);
    Purchase createPurchase(PurchaseDTO dto);
}
