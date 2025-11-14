package com.adoptionplatform.backend.config;

import com.adoptionplatform.backend.model.User;
import com.adoptionplatform.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Automatically initializes default users (Admin and Doctor) on application startup
 * if they don't already exist in the database.
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            System.out.println("=== Database Initialization Started ===");
            
            // Create Admin user if not exists
            String adminEmail = "admin@petapp.local";
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("✅ ADMIN account created: " + adminEmail + " / admin123");
            } else {
                System.out.println("ℹ️  ADMIN account already exists: " + adminEmail);
            }
            
            // Create Doctor user if not exists
            String doctorEmail = "doctor@petapp.local";
            if (userRepository.findByEmail(doctorEmail).isEmpty()) {
                User doctor = new User();
                doctor.setName("Doctor");
                doctor.setEmail(doctorEmail);
                doctor.setPassword(passwordEncoder.encode("doctor123"));
                doctor.setRole("DOCTOR");
                userRepository.save(doctor);
                System.out.println("✅ DOCTOR account created: " + doctorEmail + " / doctor123");
            } else {
                System.out.println("ℹ️  DOCTOR account already exists: " + doctorEmail);
            }
            
            System.out.println("=== Database Initialization Complete ===");
            System.out.println();
            System.out.println("📋 Available Accounts:");
            System.out.println("   ADMIN:  " + adminEmail + " / admin123");
            System.out.println("   DOCTOR: " + doctorEmail + " / doctor123");
            System.out.println("   USER:   Register at http://localhost:5173/register");
            System.out.println();
        };
    }
}
