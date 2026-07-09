package com.example.customermanagement;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.Test;

class BackendApplicationTests {

    @Test
    void mainClassCanBeLoaded() {
        assertDoesNotThrow(() -> Class.forName("com.example.customermanagement.BackendApplication"));
    }
}
