package com.haulage.service;

import com.haulage.domain.Job;
import com.haulage.domain.Truck;
import com.haulage.domain.Driver;
import com.haulage.domain.enums.JobStatus;
import com.haulage.domain.enums.TruckStatus;
import com.haulage.repository.JobRepository;
import com.haulage.repository.TruckRepository;
import com.haulage.repository.DriverRepository;
import com.haulage.service.exceptions.BusinessRuleViolationException;
import com.haulage.service.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;

@Service
public class JobService {

    private static final EnumSet<JobStatus> ACTIVE_STATUSES = EnumSet.of(
            JobStatus.PENDING,
            JobStatus.ASSIGNED,
            JobStatus.IN_TRANSIT
    );

    private final JobRepository jobRepository;
    private final TruckRepository truckRepository;
    private final DriverRepository driverRepository;
    private final TruckService truckService;
    private final DriverService driverService;

    public JobService(JobRepository jobRepository,
                       TruckRepository truckRepository,
                       DriverRepository driverRepository,
                       TruckService truckService,
                       DriverService driverService) {
        this.jobRepository = jobRepository;
        this.truckRepository = truckRepository;
        this.driverRepository = driverRepository;
        this.truckService = truckService;
        this.driverService = driverService;
    }

    @Transactional
    public Job createJob(Long truckId,
                           Long driverId,
                           String pickupLocation,
                           String deliveryLocation,
                           String cargoDescription) {

        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new NotFoundException("Truck not found: " + truckId));
        truckService.requireTruckAvailableForAssignment(truck);

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new NotFoundException("Driver not found: " + driverId));
        driverService.requireDriverHasNoActiveJobs(driver.getDriverId());

        Job job = new Job();
        job.setPickupLocation(pickupLocation);
        job.setDeliveryLocation(deliveryLocation);
        job.setCargoDescription(cargoDescription);
        job.setStatus(JobStatus.ASSIGNED);
        job.setAssignedTruck(truck);
        job.setAssignedDriver(driver);

        return jobRepository.save(job);
    }

    @Transactional(readOnly = true)
    public Job getJob(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new NotFoundException("Job not found: " + jobId));
    }

    @Transactional(readOnly = true)
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Transactional
    public Job updateJobStatus(Long jobId, JobStatus newStatus) {
        Job job = getJob(jobId);

        if (job.getStatus() == newStatus) {
            return job;
        }

        Truck truck = job.getAssignedTruck();
        if (truck == null) {
            throw new IllegalStateException("Job has no assigned truck");
        }

        switch (newStatus) {
            case IN_TRANSIT -> {
                if (truck.getStatus() == TruckStatus.UNDER_MAINTENANCE) {
                    throw new BusinessRuleViolationException("Cannot move job to IN_TRANSIT while truck is UNDER_MAINTENANCE");
                }
                // If the truck is in another state, only allow transition into IN_TRANSIT from AVAILABLE.
                if (truck.getStatus() != TruckStatus.AVAILABLE && truck.getStatus() != TruckStatus.IN_TRANSIT) {
                    throw new BusinessRuleViolationException("Truck must be AVAILABLE to start IN_TRANSIT");
                }
                truck.setStatus(TruckStatus.IN_TRANSIT);
            }
            case DELIVERED, CANCELLED -> truck.setStatus(TruckStatus.AVAILABLE);
            case PENDING, ASSIGNED -> {
                // Keep truck available while the job isn't in transit.
                if (truck.getStatus() != TruckStatus.UNDER_MAINTENANCE) {
                    truck.setStatus(TruckStatus.AVAILABLE);
                }
            }
        }

        job.setStatus(newStatus);

        // Persist both sides in one transaction (truck is the object referenced by the job).
        truckRepository.save(truck);
        return jobRepository.save(job);
    }

    @Transactional
    public void deleteJob(Long jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new NotFoundException("Job not found: " + jobId);
        }
        jobRepository.deleteById(jobId);
    }
}

