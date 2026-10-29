package com.warehouse.service;

import com.warehouse.entity.Supplier;
import com.warehouse.dto.SupplierDTO;
import java.util.List;

public interface SupplierService {
    List<Supplier> getAllSuppliers();
    Supplier getSupplierById(Long id);
    Supplier createSupplier(SupplierDTO dto);
    Supplier updateSupplier(Long id, SupplierDTO dto);
    void deleteSupplier(Long id);
    List<Supplier> searchSuppliers(String keyword);
}
