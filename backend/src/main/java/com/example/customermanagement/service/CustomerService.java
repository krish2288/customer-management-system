package com.example.customermanagement.service;

import com.example.customermanagement.dto.CustomerRequestDto;
import com.example.customermanagement.dto.CustomerResponseDto;
import java.util.List;

public interface CustomerService {

    CustomerResponseDto createCustomer(CustomerRequestDto request);

    List<CustomerResponseDto> getAllCustomers();

    CustomerResponseDto getCustomerById(String customerId);

    CustomerResponseDto updateCustomer(String customerId, CustomerRequestDto request);

    void deleteCustomer(String customerId);
}
