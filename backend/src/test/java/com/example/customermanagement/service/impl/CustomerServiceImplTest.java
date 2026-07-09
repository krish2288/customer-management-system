package com.example.customermanagement.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.customermanagement.dto.CustomerRequestDto;
import com.example.customermanagement.dto.CustomerResponseDto;
import com.example.customermanagement.entity.Customer;
import com.example.customermanagement.entity.CustomerStatus;
import com.example.customermanagement.entity.Gender;
import com.example.customermanagement.exception.DuplicateEmailException;
import com.example.customermanagement.exception.ResourceNotFoundException;
import com.example.customermanagement.repository.CustomerRepository;
import com.example.customermanagement.service.CustomerIdGenerator;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CustomerServiceImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CustomerIdGenerator customerIdGenerator;

    private CustomerServiceImpl customerService;

    @BeforeEach
    void setUp() {
        customerService = new CustomerServiceImpl(customerRepository, customerIdGenerator);
    }

    @Test
    void createCustomerSuccessfully() {
        CustomerRequestDto request = request("john@example.com", null);

        when(customerRepository.existsByEmailIgnoreCase("john@example.com")).thenReturn(false);
        when(customerIdGenerator.generateCustomerId()).thenReturn("CUST001");
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CustomerResponseDto response = customerService.createCustomer(request);

        assertEquals("CUST001", response.customerId());
        assertEquals("John", response.firstName());
        assertEquals("john@example.com", response.email());
        assertEquals(CustomerStatus.ACTIVE, response.status());

        ArgumentCaptor<Customer> customerCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(customerCaptor.capture());
        assertEquals("CUST001", customerCaptor.getValue().getCustomerId());
    }

    @Test
    void createCustomerFailsWhenEmailAlreadyExists() {
        CustomerRequestDto request = request("john@example.com", CustomerStatus.ACTIVE);
        when(customerRepository.existsByEmailIgnoreCase("john@example.com")).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> customerService.createCustomer(request));

        verify(customerIdGenerator, never()).generateCustomerId();
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    void getCustomerByIdSuccessfully() {
        Customer customer = customer("CUST001", "john@example.com", CustomerStatus.ACTIVE);
        when(customerRepository.findById("CUST001")).thenReturn(Optional.of(customer));

        CustomerResponseDto response = customerService.getCustomerById("CUST001");

        assertEquals("CUST001", response.customerId());
        assertEquals("john@example.com", response.email());
    }

    @Test
    void getCustomerByIdThrowsResourceNotFoundException() {
        when(customerRepository.findById("CUST404")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> customerService.getCustomerById("CUST404"));
    }

    @Test
    void updateCustomerSuccessfully() {
        Customer existingCustomer = customer("CUST001", "john@example.com", CustomerStatus.ACTIVE);
        CustomerRequestDto request = request("john.updated@example.com", CustomerStatus.INACTIVE);

        when(customerRepository.findById("CUST001")).thenReturn(Optional.of(existingCustomer));
        when(customerRepository.existsByEmailIgnoreCaseAndCustomerIdNot(
                "john.updated@example.com",
                "CUST001"
        )).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CustomerResponseDto response = customerService.updateCustomer("CUST001", request);

        assertEquals("CUST001", response.customerId());
        assertEquals("john.updated@example.com", response.email());
        assertEquals(CustomerStatus.INACTIVE, response.status());
    }

    @Test
    void updateCustomerFailsWhenAnotherCustomerUsesRequestedEmail() {
        Customer existingCustomer = customer("CUST001", "john@example.com", CustomerStatus.ACTIVE);
        CustomerRequestDto request = request("jane@example.com", CustomerStatus.ACTIVE);

        when(customerRepository.findById("CUST001")).thenReturn(Optional.of(existingCustomer));
        when(customerRepository.existsByEmailIgnoreCaseAndCustomerIdNot("jane@example.com", "CUST001"))
                .thenReturn(true);

        assertThrows(
                DuplicateEmailException.class,
                () -> customerService.updateCustomer("CUST001", request)
        );

        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    void deleteCustomerSuccessfully() {
        Customer customer = customer("CUST001", "john@example.com", CustomerStatus.ACTIVE);
        when(customerRepository.findById("CUST001")).thenReturn(Optional.of(customer));

        customerService.deleteCustomer("CUST001");

        verify(customerRepository).delete(customer);
    }

    @Test
    void deleteCustomerThrowsResourceNotFoundExceptionWhenCustomerDoesNotExist() {
        when(customerRepository.findById("CUST404")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> customerService.deleteCustomer("CUST404"));

        verify(customerRepository, never()).delete(any(Customer.class));
    }

    private CustomerRequestDto request(String email, CustomerStatus status) {
        return new CustomerRequestDto(
                " John ",
                " Doe ",
                email,
                "9876543210",
                LocalDate.of(1990, 1, 15),
                Gender.MALE,
                " 123 Main Street ",
                " Bangalore ",
                " Karnataka ",
                "560001",
                status
        );
    }

    private Customer customer(String customerId, String email, CustomerStatus status) {
        return new Customer(
                customerId,
                "John",
                "Doe",
                email,
                "9876543210",
                LocalDate.of(1990, 1, 15),
                Gender.MALE,
                "123 Main Street",
                "Bangalore",
                "Karnataka",
                "560001",
                status
        );
    }
}
