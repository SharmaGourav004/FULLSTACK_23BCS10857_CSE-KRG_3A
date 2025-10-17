package com.example.petbackend.controller;

import com.example.petbackend.model.Role;
import com.example.petbackend.model.User;
import com.example.petbackend.payload.JwtResponse;
import com.example.petbackend.payload.LoginRequest;
import com.example.petbackend.payload.RegisterRequest;
import com.example.petbackend.repository.RoleRepository;
import com.example.petbackend.repository.UserRepository;
import com.example.petbackend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email already in use");
        }
        User u = new User(req.getName(), req.getEmail(), passwordEncoder.encode(req.getPassword()));
        Role userRole = roleRepository.findByName("ROLE_USER").orElse(new Role("ROLE_USER"));
        roleRepository.save(userRole);
        u.getRoles().add(userRole);
        userRepository.save(u);
        String token = jwtUtils.generateJwtToken(u.getEmail());
        return ResponseEntity.ok(new JwtResponse(token, u.getId(), u.getEmail(), u.getRoles().stream().map(Role::getName).collect(Collectors.toList())));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User u = userRepository.findByEmail(req.getEmail()).orElse(null);
        if (u == null) return ResponseEntity.status(401).body("Invalid credentials");
        if (!passwordEncoder.matches(req.getPassword(), u.getPassword())) return ResponseEntity.status(401).body("Invalid credentials");
        String token = jwtUtils.generateJwtToken(u.getEmail());
        return ResponseEntity.ok(new JwtResponse(token, u.getId(), u.getEmail(), u.getRoles().stream().map(Role::getName).collect(Collectors.toList())));
    }
}
