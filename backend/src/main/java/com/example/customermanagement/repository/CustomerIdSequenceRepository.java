package com.example.customermanagement.repository;

import com.example.customermanagement.entity.CustomerIdSequence;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerIdSequenceRepository extends JpaRepository<CustomerIdSequence, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select sequence from CustomerIdSequence sequence where sequence.sequenceName = :sequenceName")
    Optional<CustomerIdSequence> findBySequenceNameForUpdate(@Param("sequenceName") String sequenceName);
}
