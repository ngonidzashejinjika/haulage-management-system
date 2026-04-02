package com.haulage.repository;

import com.haulage.domain.Job;
import com.haulage.domain.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

        @Query("""
                        select j
                        from Job j
                        where j.assignedDriver.driverId = :driverId
                          and j.status in :statuses
                        """)
        List<Job> findActiveJobsByDriverId(
                        @Param("driverId") Long driverId,
                        @Param("statuses") Collection<JobStatus> statuses);

        boolean existsByAssignedTruckTruckIdAndStatusIn(Long truckId, Collection<JobStatus> statuses);
}
