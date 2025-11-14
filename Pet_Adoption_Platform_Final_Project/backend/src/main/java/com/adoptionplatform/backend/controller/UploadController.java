package com.adoptionplatform.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final Cloudinary cloudinary;
    
    // Allowed image file types
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public UploadController(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @GetMapping("/test")
    public ResponseEntity<?> testCloudinary() {
        try {
            // Test Cloudinary configuration
            Map<String, Object> config = cloudinary.config.asMap();
            
            // Test network connectivity
            String networkStatus = "Unknown";
            try {
                java.net.InetAddress.getByName("api.cloudinary.com");
                networkStatus = "Can reach api.cloudinary.com";
            } catch (java.net.UnknownHostException e) {
                networkStatus = "Cannot reach api.cloudinary.com - Network issue or DNS problem";
            }
            
            return ResponseEntity.ok(Map.of(
                "status", "Cloudinary configured",
                "cloud_name", config.get("cloud_name"),
                "api_key_configured", config.get("api_key") != null && !config.get("api_key").toString().isEmpty(),
                "network_test", networkStatus
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Cloudinary configuration error: " + e.getMessage()
            ));
        }
    }

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("=== Upload Request Received ===");
            System.out.println("File name: " + (file != null ? file.getOriginalFilename() : "null"));
            System.out.println("File size: " + (file != null ? file.getSize() : 0) + " bytes");
            System.out.println("Content type: " + (file != null ? file.getContentType() : "null"));
            
            // Validate file is not empty
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty. Please select an image file."));
            }

            // Validate file size
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", 
                    String.format("File size exceeds maximum allowed size of %d MB. Your file is %.2f MB.", 
                        MAX_FILE_SIZE / (1024 * 1024), 
                        file.getSize() / (1024.0 * 1024.0))
                ));
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", 
                    "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
                ));
            }

            // Validate file extension as additional check
            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null) {
                String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
                List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");
                if (!allowedExtensions.contains(extension)) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "error", 
                        "Invalid file extension. Only .jpg, .jpeg, .png, .gif, and .webp files are allowed."
                    ));
                }
            }

            // Upload to Cloudinary with optimization settings
            System.out.println("Starting Cloudinary upload...");
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadOptions = (Map<String, Object>) ObjectUtils.asMap(
                "resource_type", "image",
                "folder", "pet-adoption",
                "use_filename", true,
                "unique_filename", true
            );
    
            // Convert MultipartFile to byte array for Cloudinary upload
            // This is the recommended approach for Spring Boot MultipartFile
            byte[] fileBytes = file.getBytes();
            System.out.println("Converted file to byte array: " + fileBytes.length + " bytes");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader().upload(fileBytes, uploadOptions);
            
            if (uploadResult == null) {
                System.err.println("ERROR: Cloudinary returned null result");
                return ResponseEntity.status(500).body(Map.of("error", "Upload failed: No response from Cloudinary."));
            }
            
            String url = (String) uploadResult.get("secure_url");
            if (url == null || url.isEmpty()) {
                System.err.println("ERROR: No secure_url in Cloudinary response");
                return ResponseEntity.status(500).body(Map.of("error", "Upload failed: No URL returned from Cloudinary."));
            }

            System.out.println("Upload successful! URL: " + url);
            return ResponseEntity.ok(Map.of(
                "url", url,
                "public_id", uploadResult.get("public_id"),
                "format", uploadResult.get("format"),
                "bytes", uploadResult.get("bytes")
            ));
            
        } catch (java.net.UnknownHostException e) {
            System.err.println("ERROR: Cannot reach Cloudinary - Network issue");
            e.printStackTrace();
            return ResponseEntity.status(503).body(Map.of(
                "error", 
                "Cannot connect to Cloudinary (api.cloudinary.com). Please check your internet connection, firewall settings, or proxy configuration.",
                "details", e.getMessage()
            ));
        } catch (java.net.ConnectException e) {
            System.err.println("ERROR: Connection refused by Cloudinary");
            e.printStackTrace();
            return ResponseEntity.status(503).body(Map.of(
                "error", 
                "Connection to Cloudinary was refused. Please check your network settings or try again later.",
                "details", e.getMessage()
            ));
        } catch (IOException e) {
            System.err.println("ERROR: IO Exception during upload");
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", 
                "Failed to process file upload: " + e.getMessage(),
                "type", "IOException"
            ));
        } catch (Exception e) {
            // Print stack trace to server logs for easier debugging of Cloudinary SDK issues
            System.err.println("ERROR: Unexpected exception during upload");
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error",
                "Upload error: " + (e.getMessage() != null ? e.getMessage() : "Unknown error occurred"),
                "type", e.getClass().getSimpleName()
            ));
        }
    }
}


