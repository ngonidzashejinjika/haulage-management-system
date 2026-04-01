package com.haulage.repository;

import com.haulage.domain.Truck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TruckRepository extends JpaRepository<Truck, Long> {
    Optional<Truck> findByRegistrationNumber(String registrationNumber);
}

