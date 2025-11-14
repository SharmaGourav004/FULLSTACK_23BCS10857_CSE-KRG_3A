package com.adoptionplatform.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;
    @Value("${cloudinary.api-key}")
    private String apiKey;
    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", "true"); // Ensure HTTPS URLs
        
        System.out.println("Cloudinary Configuration:");
        System.out.println("  Cloud Name: " + cloudName);
        System.out.println("  API Key: " + (apiKey != null ? apiKey.substring(0, Math.min(4, apiKey.length())) + "..." : "null"));
        System.out.println("  API Secret: " + (apiSecret != null ? "***configured***" : "null"));
        
        return new Cloudinary(config);
    }
}


