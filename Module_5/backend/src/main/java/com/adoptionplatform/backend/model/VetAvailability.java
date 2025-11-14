package com.adoptionplatform.backend.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "vet_availability")
public class VetAvailability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User doctor;

    private Instant startAt;
    private int durationMinutes = 30;
    private boolean booked = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getDoctor() { return doctor; }
    public void setDoctor(User doctor) { this.doctor = doctor; }
    public Instant getStartAt() { return startAt; }
    public void setStartAt(Instant startAt) { this.startAt = startAt; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    public boolean isBooked() { return booked; }
    public void setBooked(boolean booked) { this.booked = booked; }
}


