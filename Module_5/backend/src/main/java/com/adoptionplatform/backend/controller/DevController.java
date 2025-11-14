package com.adoptionplatform.backend.controller;

import com.adoptionplatform.backend.model.Pet;
import com.adoptionplatform.backend.model.User;
import com.adoptionplatform.backend.repository.PetRepository;
import com.adoptionplatform.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dev")
public class DevController {
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DevController(PetRepository petRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.petRepository = petRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/seed")
    public ResponseEntity<?> seed() {
        if (petRepository.count() == 0) {
            Pet p1 = new Pet(); p1.setName("Bella"); p1.setSpecies("Cat"); p1.setBreed("Siamese"); p1.setAge(2); p1.setDescription("Playful and cuddly."); p1.setImageUrl("https://placekitten.com/400/300"); p1.setLocation("Chandigarh");
            Pet p2 = new Pet(); p2.setName("Charlie"); p2.setSpecies("Dog"); p2.setBreed("Beagle"); p2.setAge(3); p2.setDescription("Loves walks and treats."); p2.setImageUrl("https://placehold.co/400x300?text=Dog"); p2.setLocation("Mohali");
            Pet p3 = new Pet(); p3.setName("Luna"); p3.setSpecies("Cat"); p3.setBreed("Maine Coon"); p3.setAge(1); p3.setDescription("Gentle giant."); p3.setImageUrl("https://placekitten.com/401/300"); p3.setLocation("Panchkula");
            petRepository.save(p1);
            petRepository.save(p2);
            petRepository.save(p3);
        }
        return ResponseEntity.ok("Seeded");
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin() {
        String email = "admin@petapp.local";
        if (userRepository.findByEmail(email).isPresent()) return ResponseEntity.ok("Admin exists");
        User u = new User();
        u.setName("Admin");
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode("admin123"));
        u.setRole("ADMIN");
        userRepository.save(u);
        return ResponseEntity.ok("Admin created: " + email + " / admin123");
    }

    @PostMapping("/create-doctor")
    public ResponseEntity<?> createDoctor() {
        String email = "doctor@petapp.local";
        if (userRepository.findByEmail(email).isPresent()) return ResponseEntity.ok("Doctor exists");
        User u = new User();
        u.setName("Doctor");
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode("doctor123"));
        u.setRole("DOCTOR");
        userRepository.save(u);
        return ResponseEntity.ok("Doctor created: " + email + " / doctor123");
    }
}


