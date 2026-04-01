package com.haulage.domain;

import com.haulage.domain.enums.TruckStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "trucks",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_trucks_registration", columnNames = {"registration_number"})
        }
)
public class Truck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long truckId;

    @Column(name = "registration_number", nullable = false, unique = true, length = 32)
    private String registrationNumber;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private TruckStatus status = TruckStatus.AVAILABLE;

    public Truck() {
    }

    public Truck(String registrationNumber, BigDecimal capacity, TruckStatus status) {
        this.registrationNumber = registrationNumber;
        this.capacity = capacity;
        this.status = status;
    }

    public Long getTruckId() {
        return truckId;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public BigDecimal getCapacity() {
        return capacity;
    }

    public void setCapacity(BigDecimal capacity) {
        this.capacity = capacity;
    }

    public TruckStatus getStatus() {
        return status;
    }

    public void setStatus(TruckStatus status) {
        this.status = status;
    }
}

