package com.example.customermanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "customer_id_sequence")
public class CustomerIdSequence {

    @Id
    @Column(name = "sequence_name", length = 40, nullable = false)
    private String sequenceName;

    @Column(name = "sequence_value", nullable = false)
    private long lastValue;

    protected CustomerIdSequence() {
    }

    public CustomerIdSequence(String sequenceName, long lastValue) {
        this.sequenceName = sequenceName;
        this.lastValue = lastValue;
    }

    public String getSequenceName() {
        return sequenceName;
    }

    public long getLastValue() {
        return lastValue;
    }

    public void setLastValue(long lastValue) {
        this.lastValue = lastValue;
    }
}
