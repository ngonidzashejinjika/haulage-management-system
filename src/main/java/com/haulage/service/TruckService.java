package com.haulage.service;

import com.haulage.domain.Truck;
import com.haulage.domain.enums.TruckStatus;
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

    public TruckService(TruckRepository truckRepository) {
        this.truckRepository = truckRepository;
    }

    @Transactional
    public Truck createTruck(String registrationNumber, BigDecimal capacity) {
        Truck truck = new Truck();
        truck.setRegistrationNumber(registrationNumber);
        truck.setCapacity(capacity);
        truck.setStatus(TruckStatus.AVAILABLE);
        return truckRepository.save(truck);
    }

    @Transactional(readOnly = true)
    public Truck getTruck(Long truckId) {
        return truckRepository.findById(truckId)
                .orElseThrow(() -> new NotFoundException("Truck not found: " + truckId));
    }

    @Transactional(readOnly = true)
    public List<Truck> getAllTrucks() {
        return truckRepository.findAll();
    }

    @Transactional
    public Truck updateTruck(Long truckId, String registrationNumber, BigDecimal capacity, TruckStatus status) {
        Truck truck = getTruck(truckId);
        truck.setRegistrationNumber(registrationNumber);
        truck.setCapacity(capacity);
        truck.setStatus(status);
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
        truck.setStatus(status);
        return truckRepository.save(truck);
    }
}

