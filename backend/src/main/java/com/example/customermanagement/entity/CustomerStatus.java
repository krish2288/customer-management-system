package com.example.customermanagement.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CustomerStatus {
    ACTIVE,
    INACTIVE;

    @JsonCreator
    public static CustomerStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        for (CustomerStatus status : values()) {
            if (status.name().equalsIgnoreCase(value.trim())) {
                return status;
            }
        }

        throw new IllegalArgumentException("Invalid customer status: " + value);
    }

    @JsonValue
    public String toValue() {
        return name();
    }
}
