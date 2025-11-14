package com.adoptionplatform.backend.controller;

import com.adoptionplatform.backend.model.AdoptionRequest;
import com.adoptionplatform.backend.model.Pet;
import com.adoptionplatform.backend.model.User;
import com.adoptionplatform.backend.repository.AdoptionRepository;
import com.adoptionplatform.backend.repository.PetRepository;
import com.adoptionplatform.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adoptions")
public class AdoptionController {
    private final AdoptionRepository adoptionRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public AdoptionController(AdoptionRepository adoptionRepository, PetRepository petRepository, UserRepository userRepository) {
        this.adoptionRepository = adoptionRepository;
        this.petRepository = petRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getRequests(Authentication authentication) {
        System.out.println("GET /api/adoptions - Called");
        System.out.println("GET /api/adoptions - Authentication: " + (authentication != null ? "Present" : "Null"));
        
        // Check authentication - this endpoint requires any authenticated user
        if (authentication == null || authentication.getPrincipal() == null) {
            System.out.println("GET /api/adoptions - Authentication is null");
            return ResponseEntity.status(401).body(java.util.Map.of("error", "Authentication required"));
        }
        
        try {
            String email = (String) authentication.getPrincipal();
            System.out.println("GET /api/adoptions - User email: " + email);
            
            User user = userRepository.findByEmail(email).orElse(null);
            
            if (user == null) {
                System.out.println("GET /api/adoptions - User not found for email: " + email);
                return ResponseEntity.status(401).body(java.util.Map.of("error", "User not found"));
            }
            
            System.out.println("GET /api/adoptions - User role: " + user.getRole() + ", User ID: " + user.getId());
            
            // If authenticated user is admin, return all requests
            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                List<AdoptionRequest> requests = adoptionRepository.findAll();
                System.out.println("GET /api/adoptions - Admin: Returning " + requests.size() + " requests");
                return ResponseEntity.ok(requests);
            }
            
            // If regular user, return only their requests
            List<AdoptionRequest> requests = adoptionRepository.findByRequester_IdOrderByCreatedAtDesc(user.getId());
            System.out.println("GET /api/adoptions - User: Returning " + requests.size() + " requests for user ID: " + user.getId());
            return ResponseEntity.ok(requests);
            
        } catch (Exception e) {
            System.err.println("GET /api/adoptions - Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Failed to fetch requests: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> request(@RequestParam Long petId,
                                     @RequestParam(required = false) String message,
                                     Authentication authentication) {
        return petRepository.findById(petId).map((Pet pet) -> {
            String email = (String) authentication.getPrincipal();
            User requester = userRepository.findByEmail(email).orElse(null);
            if (requester == null) return ResponseEntity.status(401).body("User not found");
            AdoptionRequest r = new AdoptionRequest();
            r.setPet(pet);
            r.setRequester(requester);
            r.setMessage(message);
            r.setCreatedAt(java.time.Instant.now());
            r.setStatus(AdoptionRequest.RequestStatus.PENDING);
            AdoptionRequest saved = adoptionRepository.save(r);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.badRequest().body("Invalid petId"));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return adoptionRepository.findById(id).map(req -> {
            try {
                req.setStatus(AdoptionRequest.RequestStatus.valueOf(status.toUpperCase()));
                AdoptionRequest saved = adoptionRepository.save(req);
                return ResponseEntity.ok(saved);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(java.util.Map.of("error", "Invalid status: " + status));
            }
        }).orElse(ResponseEntity.status(404).body(java.util.Map.of("error", "Adoption request not found")));
    }
}


