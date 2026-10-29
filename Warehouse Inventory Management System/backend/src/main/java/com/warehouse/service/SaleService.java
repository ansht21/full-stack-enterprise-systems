package com.warehouse.service;

import com.warehouse.dto.SaleDTO;
import com.warehouse.entity.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SaleService {
    Page<Sale> getAllSales(Pageable pageable);
    Sale getSaleById(Long id);
    Sale createSale(SaleDTO dto);
}
