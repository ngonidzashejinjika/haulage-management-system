package com.haulage.controller;

import com.haulage.domain.Driver;
import com.haulage.dto.DriverCreateRequest;
import com.haulage.dto.DriverResponse;
import com.haulage.dto.DriverUpdateRequest;
import com.haulage.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @PostMapping
    public ResponseEntity<DriverResponse> create(@Valid @RequestBody DriverCreateRequest request) {
        Driver driver = driverService.createDriver(request.getName(), request.getLicenseNumber(), request.getPhoneNumber());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(driver));
    }

    @GetMapping("/{id}")
    public DriverResponse getById(@PathVariable("id") Long id) {
        return toResponse(driverService.getDriver(id));
    }

    @GetMapping
    public List<DriverResponse> getAll() {
        return driverService.getAllDrivers().stream().map(this::toResponse).toList();
    }

    @PutMapping("/{id}")
    public DriverResponse update(@PathVariable("id") Long id, @Valid @RequestBody DriverUpdateRequest request) {
        Driver driver = driverService.updateDriver(id, request.getName(), request.getLicenseNumber(), request.getPhoneNumber());
        return toResponse(driver);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        driverService.deleteDriver(id);
    }

    private DriverResponse toResponse(Driver driver) {
        return new DriverResponse(
                driver.getDriverId(),
                driver.getName(),
                driver.getLicenseNumber(),
                driver.getPhoneNumber()
        );
    }
}

