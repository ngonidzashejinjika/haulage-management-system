package com.haulage.dto;

import com.haulage.domain.enums.JobStatus;

public class JobResponse {

    private Long jobId;
    private String pickupLocation;
    private String deliveryLocation;
    private String cargoDescription;
    private JobStatus status;
    private Long assignedTruckId;
    private Long assignedDriverId;

    public JobResponse() {
    }

    public JobResponse(Long jobId,
                        String pickupLocation,
                        String deliveryLocation,
                        String cargoDescription,
                        JobStatus status,
                        Long assignedTruckId,
                        Long assignedDriverId) {
        this.jobId = jobId;
        this.pickupLocation = pickupLocation;
        this.deliveryLocation = deliveryLocation;
        this.cargoDescription = cargoDescription;
        this.status = status;
        this.assignedTruckId = assignedTruckId;
        this.assignedDriverId = assignedDriverId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getDeliveryLocation() {
        return deliveryLocation;
    }

    public void setDeliveryLocation(String deliveryLocation) {
        this.deliveryLocation = deliveryLocation;
    }

    public String getCargoDescription() {
        return cargoDescription;
    }

    public void setCargoDescription(String cargoDescription) {
        this.cargoDescription = cargoDescription;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public Long getAssignedTruckId() {
        return assignedTruckId;
    }

    public void setAssignedTruckId(Long assignedTruckId) {
        this.assignedTruckId = assignedTruckId;
    }

    public Long getAssignedDriverId() {
        return assignedDriverId;
    }

    public void setAssignedDriverId(Long assignedDriverId) {
        this.assignedDriverId = assignedDriverId;
    }
}

