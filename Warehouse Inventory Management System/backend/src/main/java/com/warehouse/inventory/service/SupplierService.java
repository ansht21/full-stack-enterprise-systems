package com.warehouse.inventory.service;

import com.warehouse.inventory.dto.SupplierDtos.SupplierRequest;
import com.warehouse.inventory.dto.SupplierDtos.SupplierResponse;
import com.warehouse.inventory.entity.Supplier;
import com.warehouse.inventory.exception.ResourceNotFoundException;
import com.warehouse.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public Page<SupplierResponse> list(String search, Pageable pageable) {
        Page<Supplier> page = (search == null || search.isBlank())
                ? supplierRepository.findAll(pageable)
                : supplierRepository.findByNameContainingIgnoreCase(search, pageable);
        return page.map(this::toResponse);
    }

    public SupplierResponse get(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public SupplierResponse create(SupplierRequest req) {
        Supplier supplier = Supplier.builder()
                .name(req.name())
                .email(req.email())
                .phone(req.phone())
                .address(req.address())
                .build();
        return toResponse(supplierRepository.save(supplier));
    }

    @Transactional
    public SupplierResponse update(Long id, SupplierRequest req) {
        Supplier supplier = findById(id);
        supplier.setName(req.name());
        supplier.setEmail(req.email());
        supplier.setPhone(req.phone());
        supplier.setAddress(req.address());
        return toResponse(supplierRepository.save(supplier));
    }

    @Transactional
    public void delete(Long id) {
        supplierRepository.delete(findById(id));
    }

    private Supplier findById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + id));
    }

    private SupplierResponse toResponse(Supplier s) {
        return new SupplierResponse(s.getId(), s.getName(), s.getEmail(), s.getPhone(), s.getAddress());
    }
}
