package com.example.customermanagement.dto;

import com.example.customermanagement.entity.CustomerStatus;
import com.example.customermanagement.entity.Gender;
import com.example.customermanagement.validation.MinimumAge;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CustomerRequestDto(
        @NotBlank(message = "First name is required")
        @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Mobile number is required")
        @Pattern(regexp = "\\d{10}", message = "Mobile number must contain exactly 10 digits")
        String mobileNumber,

        @NotNull(message = "Date of birth is required")
        @MinimumAge(value = 18, message = "Customer must be at least 18 years old")
        LocalDate dateOfBirth,

        @NotNull(message = "Gender is required")
        Gender gender,

        @NotBlank(message = "Address is required")
        @Size(max = 250, message = "Address cannot exceed 250 characters")
        String address,

        @NotBlank(message = "City is required")
        @Size(min = 2, max = 50, message = "City must be between 2 and 50 characters")
        String city,

        @NotBlank(message = "State is required")
        String state,

        @NotBlank(message = "Pincode is required")
        @Pattern(regexp = "\\d{6}", message = "Pincode must contain exactly 6 digits")
        String pincode,

        CustomerStatus status
) {
}
