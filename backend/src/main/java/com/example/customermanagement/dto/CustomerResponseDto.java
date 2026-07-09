package com.example.customermanagement.dto;

import com.example.customermanagement.entity.CustomerStatus;
import com.example.customermanagement.entity.Gender;
import java.time.LocalDate;

public record CustomerResponseDto(
        String customerId,
        String firstName,
        String lastName,
        String email,
        String mobileNumber,
        LocalDate dateOfBirth,
        Gender gender,
        String address,
        String city,
        String state,
        String pincode,
        CustomerStatus status
) {
}
