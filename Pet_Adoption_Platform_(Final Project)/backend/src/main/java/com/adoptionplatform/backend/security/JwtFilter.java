package com.adoptionplatform.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String requestUri = request.getRequestURI();
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                if (jwtUtil.validateToken(token)) {
                    String subject = jwtUtil.getSubjectFromToken(token);
                    String email = subject;
                    String role = jwtUtil.getRoleFromToken(token);
                    String authority = role != null ? ("ROLE_" + role.toUpperCase()) : "ROLE_USER";
                    
                    System.out.println("JwtFilter [" + requestUri + "] - Setting authentication for: " + email + " with role: " + authority);
                    
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            email, null, List.of(new SimpleGrantedAuthority(authority)));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    System.out.println("JwtFilter [" + requestUri + "] - Authentication set successfully");
                } else {
                    System.out.println("JwtFilter [" + requestUri + "] - Token validation failed");
                }
            } catch (Exception e) {
                System.err.println("JwtFilter [" + requestUri + "] - Error processing token: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("JwtFilter [" + requestUri + "] - No Authorization header found");
        }
        filterChain.doFilter(request, response);
    }
}
