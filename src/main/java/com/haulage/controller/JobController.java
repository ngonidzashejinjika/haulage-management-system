package com.haulage.controller;

import com.haulage.domain.Job;
import com.haulage.domain.enums.JobStatus;
import com.haulage.dto.JobCreateRequest;
import com.haulage.dto.JobResponse;
import com.haulage.dto.JobStatusUpdateRequest;
import com.haulage.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<JobResponse> create(@Valid @RequestBody JobCreateRequest request) {
        Job job = jobService.createJob(
                request.getTruckId(),
                request.getDriverId(),
                request.getPickupLocation(),
                request.getDeliveryLocation(),
                request.getCargoDescription()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(job));
    }

    @GetMapping("/{id}")
    public JobResponse getById(@PathVariable("id") Long id) {
        return toResponse(jobService.getJob(id));
    }

    @GetMapping
    public List<JobResponse> getAll() {
        return jobService.getAllJobs().stream().map(this::toResponse).toList();
    }

    @PatchMapping("/{id}/status")
    public JobResponse updateStatus(@PathVariable("id") Long id, @Valid @RequestBody JobStatusUpdateRequest request) {
        Job job = jobService.updateJobStatus(id, request.getStatus());
        return toResponse(job);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        jobService.deleteJob(id);
    }

    private JobResponse toResponse(Job job) {
        return new JobResponse(
                job.getJobId(),
                job.getPickupLocation(),
                job.getDeliveryLocation(),
                job.getCargoDescription(),
                job.getStatus(),
                job.getAssignedTruck().getTruckId(),
                job.getAssignedDriver().getDriverId()
        );
    }
}

