package com.adoptionplatform.backend.controller;

import com.adoptionplatform.backend.dto.AuthRequest;
import com.adoptionplatform.backend.dto.LoginResponse;
import com.adoptionplatform.backend.dto.RegisterRequest;
import com.adoptionplatform.backend.model.User;
import com.adoptionplatform.backend.security.JwtUtil;
import com.adoptionplatform.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        User created = userService.register(req);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req) {
        return userService.findByEmail(req.getEmail())
                .map(user -> {
                    if (passwordEncoder.matches(req.getPassword(), user.getPassword())) {
                        // Include role in JWT token so @PreAuthorize can check it
                        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
                        return ResponseEntity.ok(new LoginResponse(token, user.getEmail(), user.getRole(), user.getName()));
                    }
                    return ResponseEntity.status(401).body(java.util.Map.of("error", "Invalid credentials"));
                })
                .orElse(ResponseEntity.status(404).body(java.util.Map.of("error", "User not found")));
    }
}
