package com.adoptionplatform.backend.controller;

import com.adoptionplatform.backend.model.User;
import com.adoptionplatform.backend.model.VetBooking;
import com.adoptionplatform.backend.model.VetAvailability;
import com.adoptionplatform.backend.repository.UserRepository;
import com.adoptionplatform.backend.repository.VetAvailabilityRepository;
import com.adoptionplatform.backend.repository.VetBookingRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/vet")
public class VetController {
    private final VetBookingRepository vetBookingRepository;
    private final UserRepository userRepository;
    private final VetAvailabilityRepository vetAvailabilityRepository;

    public VetController(VetBookingRepository vetBookingRepository, UserRepository userRepository, VetAvailabilityRepository vetAvailabilityRepository) {
        this.vetBookingRepository = vetBookingRepository;
        this.userRepository = userRepository;
        this.vetAvailabilityRepository = vetAvailabilityRepository;
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public List<VetBooking> list(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
                                 @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        Instant f = from == null ? Instant.now().minus(30, ChronoUnit.DAYS) : from;
        Instant t = to == null ? Instant.now().plus(30, ChronoUnit.DAYS) : to;
        return vetBookingRepository.findByStartAtBetween(f, t);
    }

    @GetMapping("/appointments/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<VetBooking> userBookings(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return List.of();
        }
        String email = (String) authentication.getPrincipal();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return List.of();
        }
        return vetBookingRepository.findByUser_IdOrderByStartAtDesc(user.getId());
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> book(@RequestParam(value = "at", required = false) String at,
                                  @RequestParam(value = "availabilityId", required = false) Long availabilityId,
                                  @RequestParam(required = false, defaultValue = "30") int duration,
                                  @RequestParam(required = false) String phone,
                                  @RequestParam(required = false) String message,
                                  Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body("Authentication required");
            }
            
            Instant instant;
            VetAvailability availability = null;
            if (availabilityId != null) {
                availability = vetAvailabilityRepository.findById(availabilityId).orElse(null);
                if (availability == null) {
                    return ResponseEntity.badRequest().body("Availability slot not found");
                }
                if (availability.isBooked()) {
                    return ResponseEntity.badRequest().body("Slot is already booked");
                }
                instant = availability.getStartAt();
                duration = availability.getDurationMinutes();
            } else {
                if (at == null) {
                    return ResponseEntity.badRequest().body("Either 'at' or 'availabilityId' parameter is required");
                }
                try {
                    if (at.endsWith("Z")) {
                        // ISO-8601 with Z suffix (UTC)
                        instant = Instant.parse(at);
                    } else if (at.contains("+") || at.lastIndexOf("-") > 10) {
                        // ISO-8601 with timezone offset
                        instant = Instant.parse(at);
                    } else {
                        // Local datetime without timezone, treat as system default timezone
                        java.time.LocalDateTime ldt = java.time.LocalDateTime.parse(at);
                        instant = ldt.atZone(java.time.ZoneId.systemDefault()).toInstant();
                    }
                } catch (Exception e) {
                    System.err.println("Failed to parse datetime: " + at);
                    e.printStackTrace();
                    return ResponseEntity.badRequest().body("Invalid datetime format. Expected ISO-8601 format like '2025-11-04T09:25:00' or '2025-11-04T09:25:00Z'. Error: " + e.getMessage());
                }
                // Check for conflicts with existing bookings
                Instant from = instant.minus(29, ChronoUnit.MINUTES);
                Instant to = instant.plus(duration, ChronoUnit.MINUTES);
                List<VetBooking> conflicts = vetBookingRepository.findByStartAtBetween(from, to);
                if (!conflicts.isEmpty()) {
                    return ResponseEntity.badRequest().body("Slot conflicts with existing booking");
                }
            }
            
            String email = (String) authentication.getPrincipal();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body("User not found");
            }
            
            VetBooking v = new VetBooking();
            v.setUser(user);
            v.setStartAt(instant);
            v.setDurationMinutes(duration);
            if (phone != null && !phone.trim().isEmpty()) {
                v.setPhone(phone.trim());
            }
            if (message != null && !message.trim().isEmpty()) {
                v.setMessage(message.trim());
            }
            if (availability != null && availability.getDoctor() != null) {
                v.setDoctor(availability.getDoctor());
            }
            VetBooking saved = vetBookingRepository.save(v);
            
            // Mark availability as booked if it was booked via availabilityId
            if (availability != null) {
                availability.setBooked(true);
                vetAvailabilityRepository.save(availability);
            }
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Booking failed: " + e.getMessage());
        }
    }

    // Doctor availability
    @GetMapping("/availability")
    public List<VetAvailability> listAvailability(@RequestParam(required = false) Long doctorId,
                                                   @RequestParam(required = false) Boolean mySlots,
                                                   Authentication authentication) {
        // If mySlots is true, return slots for the authenticated doctor
        if (Boolean.TRUE.equals(mySlots) && authentication != null) {
            String email = (String) authentication.getPrincipal();
            User doctor = userRepository.findByEmail(email).orElse(null);
            if (doctor != null) {
                return vetAvailabilityRepository.findByDoctor_IdOrderByStartAtDesc(doctor.getId());
            }
        }
        // If doctorId is provided, return all slots for that doctor (including booked ones)
        if (doctorId != null) {
            return vetAvailabilityRepository.findByDoctor_IdOrderByStartAtDesc(doctorId);
        }
        // Return all available (not booked) slots that start after 1 hour ago
        return vetAvailabilityRepository.findByStartAtAfterAndBookedIsFalseOrderByStartAtAsc(Instant.now().minus(1, ChronoUnit.HOURS));
    }

    @PostMapping("/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAvailability(@RequestParam("at") String at,
                                                @RequestParam(required = false, defaultValue = "30") int duration,
                                                Authentication authentication) {
        try {
            System.out.println("=== Create Availability Request ===");
            System.out.println("Received datetime: " + at);
            System.out.println("Duration: " + duration + " minutes");
            
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body(java.util.Map.of("error", "Authentication required"));
            }
            
            Instant instant;
            try {
                if (at.endsWith("Z")) {
                    // ISO-8601 with Z suffix (UTC)
                    instant = Instant.parse(at);
                } else if (at.contains("+") || at.lastIndexOf("-") > 10) {
                    // ISO-8601 with timezone offset
                    instant = Instant.parse(at);
                } else {
                    // Local datetime without timezone, treat as system default timezone
                    java.time.LocalDateTime ldt = java.time.LocalDateTime.parse(at);
                    instant = ldt.atZone(java.time.ZoneId.systemDefault()).toInstant();
                }
            } catch (Exception e) {
                System.err.println("Failed to parse datetime: " + at);
                e.printStackTrace();
                return ResponseEntity.badRequest().body(java.util.Map.of(
                    "error", "Invalid datetime format. Expected ISO-8601 format like '2025-11-04T09:25:00' or '2025-11-04T09:25:00Z'",
                    "received", at,
                    "details", e.getMessage()
                ));
            }
            
            String email = (String) authentication.getPrincipal();
            User doctor = userRepository.findByEmail(email).orElse(null);
            if (doctor == null) {
                return ResponseEntity.status(401).body(java.util.Map.of("error", "User not found"));
            }
            
            VetAvailability a = new VetAvailability();
            a.setDoctor(doctor);
            a.setStartAt(instant);
            a.setDurationMinutes(duration);
            VetAvailability saved = vetAvailabilityRepository.save(a);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Failed to create availability: " + e.getMessage()));
        }
    }

    @DeleteMapping("/availability/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long id, Authentication authentication) {
        return vetAvailabilityRepository.findById(id).map(a -> {
            String email = (String) authentication.getPrincipal();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) return ResponseEntity.status(401).build();
            boolean isOwner = a.getDoctor() != null && a.getDoctor().getId().equals(user.getId());
            boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());
            if (!isOwner && !isAdmin) return ResponseEntity.status(403).build();
            if (a.isBooked()) return ResponseEntity.badRequest().body("Cannot delete booked slot");
            vetAvailabilityRepository.delete(a);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/appointments/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication authentication) {
        return vetBookingRepository.findById(id).map(booking -> {
            String email = (String) authentication.getPrincipal();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) return ResponseEntity.status(401).build();
            
            // Check if user is the owner of the booking or an admin
            boolean isOwner = booking.getUser() != null && booking.getUser().getId().equals(user.getId());
            boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());
            if (!isOwner && !isAdmin) {
                return ResponseEntity.status(403).body("You don't have permission to cancel this appointment");
            }
            
            // Find the corresponding availability slot and mark it as available again
            VetAvailability availability = vetAvailabilityRepository
                .findByDoctorAndStartAt(booking.getDoctor(), booking.getStartAt());
            if (availability != null) {
                availability.setBooked(false);
                vetAvailabilityRepository.save(availability);
            }
            
            // Delete the booking
            vetBookingRepository.delete(booking);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}




