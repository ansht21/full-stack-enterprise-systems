package com.warehouse.inventory.exception;

/** Thrown when an entity cannot be found by id. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
