package com.haulage.dto;

import com.haulage.domain.enums.TruckStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class TruckUpdateRequest {

    @NotBlank
    private String registrationNumber;

    @NotNull
    @DecimalMin(value = "0.01", inclusive = true)
    private BigDecimal capacity;

    @NotNull
    private TruckStatus status;

    public TruckUpdateRequest() {
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

