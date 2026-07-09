package com.example.customermanagement.service.impl;

import com.example.customermanagement.dto.CustomerRequestDto;
import com.example.customermanagement.dto.CustomerResponseDto;
import com.example.customermanagement.entity.Customer;
import com.example.customermanagement.entity.CustomerStatus;
import com.example.customermanagement.exception.DuplicateEmailException;
import com.example.customermanagement.exception.ResourceNotFoundException;
import com.example.customermanagement.repository.CustomerRepository;
import com.example.customermanagement.service.CustomerIdGenerator;
import com.example.customermanagement.service.CustomerService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerIdGenerator customerIdGenerator;

    public CustomerServiceImpl(
            CustomerRepository customerRepository,
            CustomerIdGenerator customerIdGenerator
    ) {
        this.customerRepository = customerRepository;
        this.customerIdGenerator = customerIdGenerator;
    }

    @Override
    @Transactional
    public CustomerResponseDto createCustomer(CustomerRequestDto request) {
        String requestedEmail = normalizeEmail(request.email());

        if (customerRepository.existsByEmailIgnoreCase(requestedEmail)) {
            throw new DuplicateEmailException("A customer with this email already exists.");
        }

        Customer customer = new Customer(
                customerIdGenerator.generateCustomerId(),
                normalize(request.firstName()),
                normalize(request.lastName()),
                requestedEmail,
                normalize(request.mobileNumber()),
                request.dateOfBirth(),
                request.gender(),
                normalize(request.address()),
                normalize(request.city()),
                normalize(request.state()),
                normalize(request.pincode()),
                request.status() == null ? CustomerStatus.ACTIVE : request.status()
        );

        return toResponseDto(customerRepository.save(customer));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponseDto> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDto getCustomerById(String customerId) {
        return toResponseDto(findCustomer(customerId));
    }

    @Override
    @Transactional
    public CustomerResponseDto updateCustomer(String customerId, CustomerRequestDto request) {
        Customer customer = findCustomer(customerId);
        String requestedEmail = normalizeEmail(request.email());

        if (!customer.getEmail().equalsIgnoreCase(requestedEmail)
                && customerRepository.existsByEmailIgnoreCaseAndCustomerIdNot(requestedEmail, customerId)) {
            throw new DuplicateEmailException("A customer with this email already exists.");
        }

        customer.setFirstName(normalize(request.firstName()));
        customer.setLastName(normalize(request.lastName()));
        customer.setEmail(requestedEmail);
        customer.setMobileNumber(normalize(request.mobileNumber()));
        customer.setDateOfBirth(request.dateOfBirth());
        customer.setGender(request.gender());
        customer.setAddress(normalize(request.address()));
        customer.setCity(normalize(request.city()));
        customer.setState(normalize(request.state()));
        customer.setPincode(normalize(request.pincode()));

        if (request.status() != null) {
            customer.setStatus(request.status());
        }

        return toResponseDto(customerRepository.save(customer));
    }

    @Override
    @Transactional
    public void deleteCustomer(String customerId) {
        Customer customer = findCustomer(customerId);
        customerRepository.delete(customer);
    }

    private Customer findCustomer(String customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer not found with customerId: " + customerId
                ));
    }

    private CustomerResponseDto toResponseDto(Customer customer) {
        return new CustomerResponseDto(
                customer.getCustomerId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getMobileNumber(),
                customer.getDateOfBirth(),
                customer.getGender(),
                customer.getAddress(),
                customer.getCity(),
                customer.getState(),
                customer.getPincode(),
                customer.getStatus()
        );
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeEmail(String email) {
        return normalize(email).toLowerCase();
    }
}
