package com.haulage.service;

import com.haulage.domain.Driver;
import com.haulage.domain.enums.JobStatus;
import com.haulage.domain.Job;
import com.haulage.repository.DriverRepository;
import com.haulage.repository.JobRepository;
import com.haulage.service.exceptions.BusinessRuleViolationException;
import com.haulage.service.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;

@Service
public class DriverService {

    private static final EnumSet<JobStatus> ACTIVE_STATUSES = EnumSet.of(
            JobStatus.PENDING,
            JobStatus.ASSIGNED,
            JobStatus.IN_TRANSIT
    );

    private final DriverRepository driverRepository;
    private final JobRepository jobRepository;

    public DriverService(DriverRepository driverRepository, JobRepository jobRepository) {
        this.driverRepository = driverRepository;
        this.jobRepository = jobRepository;
    }

    @Transactional
    public Driver createDriver(String name, String licenseNumber, String phoneNumber) {
        Driver driver = new Driver(name, licenseNumber, phoneNumber);
        return driverRepository.save(driver);
    }

    @Transactional(readOnly = true)
    public Driver getDriver(Long driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new NotFoundException("Driver not found: " + driverId));
    }

    @Transactional(readOnly = true)
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    @Transactional
    public Driver updateDriver(Long driverId, String name, String licenseNumber, String phoneNumber) {
        Driver driver = getDriver(driverId);
        driver.setName(name);
        driver.setLicenseNumber(licenseNumber);
        driver.setPhoneNumber(phoneNumber);
        return driverRepository.save(driver);
    }

    @Transactional
    public void deleteDriver(Long driverId) {
        if (!driverRepository.existsById(driverId)) {
            throw new NotFoundException("Driver not found: " + driverId);
        }
        driverRepository.deleteById(driverId);
    }

    @Transactional(readOnly = true)
    public void requireDriverHasNoActiveJobs(Long driverId) {
        List<Job> activeJobs = jobRepository.findActiveJobsByDriverId(driverId, ACTIVE_STATUSES);
        if (!activeJobs.isEmpty()) {
            throw new BusinessRuleViolationException("Driver " + driverId + " already has an active job");
        }
    }
}

