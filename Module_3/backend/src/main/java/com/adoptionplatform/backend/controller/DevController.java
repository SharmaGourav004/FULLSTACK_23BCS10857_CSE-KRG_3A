package com.adoptionplatform.backend.controller;

import com.adoptionplatform.backend.model.User;
import com.adoptionplatform.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dev")
public class DevController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DevController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin() {
        String email = "admin@petapp.local";
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.ok("Admin already exists");
        }
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);
        return ResponseEntity.ok("Admin created: " + email + " / admin123");
    }

    @PostMapping("/create-test-user")
    public ResponseEntity<?> createTestUser() {
        String email = "user@petapp.local";
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.ok("Test user already exists");
        }
        User user = new User();
        user.setName("Test User");
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("user123"));
        user.setRole("USER");
        userRepository.save(user);
        return ResponseEntity.ok("Test user created: " + email + " / user123");
    }
}


