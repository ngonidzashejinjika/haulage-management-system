package com.haulage.dto;

import com.haulage.domain.enums.TruckStatus;

import java.math.BigDecimal;

public class TruckResponse {
    private Long truckId;
    private String registrationNumber;
    private BigDecimal capacity;
    private TruckStatus status;

    public TruckResponse() {
    }

    public TruckResponse(Long truckId, String registrationNumber, BigDecimal capacity, TruckStatus status) {
        this.truckId = truckId;
        this.registrationNumber = registrationNumber;
        this.capacity = capacity;
        this.status = status;
    }

    public Long getTruckId() {
        return truckId;
    }

    public void setTruckId(Long truckId) {
        this.truckId = truckId;
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

