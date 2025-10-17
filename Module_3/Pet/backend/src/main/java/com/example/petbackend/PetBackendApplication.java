package com.example.petbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.example.petbackend.model.Role;
import com.example.petbackend.model.User;
import com.example.petbackend.repository.RoleRepository;
import com.example.petbackend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class PetBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(PetBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner init(RoleRepository roleRepo, UserRepository userRepo, PasswordEncoder encoder) {
        return args -> {
            if (!roleRepo.findByName("ROLE_USER").isPresent()) {
                roleRepo.save(new Role("ROLE_USER"));
            }
            if (!userRepo.findByEmail("faculty@example.com").isPresent()) {
                User u = new User("Faculty","faculty@example.com", encoder.encode("password"));
                u.getRoles().add(roleRepo.findByName("ROLE_USER").get());
                userRepo.save(u);
            }
        };
    }
}
