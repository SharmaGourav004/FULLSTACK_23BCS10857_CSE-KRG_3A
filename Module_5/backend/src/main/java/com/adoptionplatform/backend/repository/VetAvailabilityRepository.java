package com.adoptionplatform.backend.repository;

import com.adoptionplatform.backend.model.User;
import com.adoptionplatform.backend.model.VetAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface VetAvailabilityRepository extends JpaRepository<VetAvailability, Long> {
    List<VetAvailability> findByStartAtAfterAndBookedIsFalseOrderByStartAtAsc(Instant after);
    List<VetAvailability> findByDoctor_IdOrderByStartAtDesc(Long doctorId);
    VetAvailability findByDoctorAndStartAt(User doctor, Instant startAt);
}




