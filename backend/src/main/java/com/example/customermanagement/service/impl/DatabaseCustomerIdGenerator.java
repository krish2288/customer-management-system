package com.example.customermanagement.service.impl;

import com.example.customermanagement.entity.CustomerIdSequence;
import com.example.customermanagement.repository.CustomerIdSequenceRepository;
import com.example.customermanagement.service.CustomerIdGenerator;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DatabaseCustomerIdGenerator implements CustomerIdGenerator {

    private static final String CUSTOMER_SEQUENCE_NAME = "CUSTOMER";
    private static final String CUSTOMER_ID_PREFIX = "CUST";

    private final CustomerIdSequenceRepository customerIdSequenceRepository;

    public DatabaseCustomerIdGenerator(CustomerIdSequenceRepository customerIdSequenceRepository) {
        this.customerIdSequenceRepository = customerIdSequenceRepository;
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRES_NEW)
    public String generateCustomerId() {
        CustomerIdSequence sequence = customerIdSequenceRepository
                .findBySequenceNameForUpdate(CUSTOMER_SEQUENCE_NAME)
                .orElseGet(() -> customerIdSequenceRepository.saveAndFlush(
                        new CustomerIdSequence(CUSTOMER_SEQUENCE_NAME, 0)
                ));

        long nextValue = sequence.getLastValue() + 1;
        sequence.setLastValue(nextValue);
        customerIdSequenceRepository.save(sequence);

        return CUSTOMER_ID_PREFIX + formatSequenceNumber(nextValue);
    }

    private String formatSequenceNumber(long sequenceNumber) {
        if (sequenceNumber < 1000) {
            return String.format("%03d", sequenceNumber);
        }

        return Long.toString(sequenceNumber);
    }
}
