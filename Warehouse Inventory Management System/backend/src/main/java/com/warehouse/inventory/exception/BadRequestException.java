package com.warehouse.inventory.exception;

/** Thrown for invalid business operations (e.g. insufficient stock, duplicate SKU). */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
