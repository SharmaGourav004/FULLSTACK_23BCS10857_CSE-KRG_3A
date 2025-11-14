package com.adoptionplatform.backend.repository;

import com.adoptionplatform.backend.model.VetBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface VetBookingRepository extends JpaRepository<VetBooking, Long> {
    List<VetBooking> findByStartAtBetween(Instant start, Instant end);
    List<VetBooking> findByDoctor_IdOrderByStartAtDesc(Long doctorId);
    List<VetBooking> findByUser_IdOrderByStartAtDesc(Long userId);
}


