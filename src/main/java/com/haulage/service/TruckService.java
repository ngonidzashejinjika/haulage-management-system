package com.haulage.service;

import com.haulage.domain.Truck;
import com.haulage.domain.enums.JobStatus;
import com.haulage.domain.enums.TruckStatus;
import com.haulage.repository.JobRepository;
import com.haulage.repository.TruckRepository;
import com.haulage.service.exceptions.BusinessRuleViolationException;
import com.haulage.service.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TruckService {

    private final TruckRepository truckRepository;
    private final JobRepository jobRepository;

    public TruckService(TruckRepository truckRepository, JobRepository jobRepository) {
        this.truckRepository = truckRepository;
        this.jobRepository = jobRepository;
    }

    @Transactional
    public Truck createTruck(String registrationNumber, BigDecimal capacity) {
        Truck truck = new Truck();
        truck.setRegistrationNumber(registrationNumber);
        truck.setCapacity(capacity);
        truck.setStatus(TruckStatus.AVAILABLE);
        return truckRepository.save(truck);
    }

    private boolean hasActiveJob(Truck truck) {
        return jobRepository.existsByAssignedTruckTruckIdAndStatusIn(
                truck.getTruckId(),
                List.of(JobStatus.ASSIGNED, JobStatus.IN_TRANSIT));
    }

    @Transactional(readOnly = true)
    public Truck getTruck(Long truckId) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new NotFoundException("Truck not found: " + truckId));

        if (truck.getStatus() != TruckStatus.UNDER_MAINTENANCE) {
            if (hasActiveJob(truck)) {
                truck.setStatus(TruckStatus.IN_TRANSIT);
            } else {
                truck.setStatus(TruckStatus.AVAILABLE);
            }
        }

        return truck;
    }

    @Transactional(readOnly = true)
    public List<Truck> getAllTrucks() {
        List<Truck> trucks = truckRepository.findAll();
        for (Truck truck : trucks) {
            if (truck.getStatus() != TruckStatus.UNDER_MAINTENANCE) {
                if (hasActiveJob(truck)) {
                    truck.setStatus(TruckStatus.IN_TRANSIT);
                } else {
                    truck.setStatus(TruckStatus.AVAILABLE);
                }
            }
        }
        return trucks;
    }

    @Transactional
    public Truck updateTruck(Long truckId, String registrationNumber, BigDecimal capacity) {
        Truck truck = getTruck(truckId);
        truck.setRegistrationNumber(registrationNumber);
        truck.setCapacity(capacity);

        return truckRepository.save(truck);
    }

    @Transactional
    public void deleteTruck(Long truckId) {
        if (!truckRepository.existsById(truckId)) {
            throw new NotFoundException("Truck not found: " + truckId);
        }
        truckRepository.deleteById(truckId);
    }

    public void requireTruckAvailableForAssignment(Truck truck) {
        if (truck.getStatus() != TruckStatus.AVAILABLE) {
            throw new BusinessRuleViolationException(
                    "Truck " + truck.getTruckId() + " cannot be assigned when status is " + truck.getStatus());
        }
    }

    @Transactional
    public Truck setTruckStatus(Long truckId, TruckStatus status) {
        Truck truck = getTruck(truckId);

        if (status == TruckStatus.UNDER_MAINTENANCE) {
            if (truck.getStatus() == TruckStatus.IN_TRANSIT) {
                throw new BusinessRuleViolationException(
                        "Cannot mark truck as UNDER_MAINTENANCE while assigned to a job.");
            }
            truck.setStatus(TruckStatus.UNDER_MAINTENANCE);
        } else {
            throw new BusinessRuleViolationException(
                    "Truck status transitions are managed via job operations (assignment/delivery). Use maintenance flag only.");
        }

        return truckRepository.save(truck);
    }
}
