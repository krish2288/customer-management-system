package com.example.customermanagement.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Gender {
    MALE("Male"),
    FEMALE("Female"),
    OTHER("Other");

    private final String displayValue;

    Gender(String displayValue) {
        this.displayValue = displayValue;
    }

    @JsonCreator
    public static Gender fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalizedValue = value.trim();
        for (Gender gender : values()) {
            if (gender.name().equalsIgnoreCase(normalizedValue)
                    || gender.displayValue.equalsIgnoreCase(normalizedValue)) {
                return gender;
            }
        }

        throw new IllegalArgumentException("Invalid gender: " + value);
    }

    @JsonValue
    public String toValue() {
        return displayValue;
    }
}
