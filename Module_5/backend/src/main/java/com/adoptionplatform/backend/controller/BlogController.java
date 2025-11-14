package com.adoptionplatform.backend.controller;

import com.adoptionplatform.backend.model.BlogPost;
import com.adoptionplatform.backend.repository.BlogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    private final BlogRepository blogRepository;

    public BlogController(BlogRepository blogRepository) { this.blogRepository = blogRepository; }

    @GetMapping
    public List<BlogPost> all() { return blogRepository.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> byId(@PathVariable Long id) {
        return blogRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public BlogPost create(@RequestBody BlogPost post, Authentication authentication) {
        post.setId(null);
        post.setCreatedAt(Instant.now());
        post.setUpdatedAt(Instant.now());
        if (authentication != null) {
            String email = (String) authentication.getPrincipal();
            post.setAuthorEmail(email);
        }
        return blogRepository.save(post);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BlogPost> update(@PathVariable Long id, @RequestBody BlogPost post, Authentication authentication) {
        BlogPost existing = blogRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        String email = authentication != null ? (String) authentication.getPrincipal() : null;
        boolean isOwner = email != null && email.equalsIgnoreCase(existing.getAuthorEmail());
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(403).build();
        }
        existing.setTitle(post.getTitle());
        existing.setContent(post.getContent());
        existing.setAuthorName(post.getAuthorName());
        existing.setCategory(post.getCategory());
        existing.setImageUrl(post.getImageUrl());
        existing.setUpdatedAt(Instant.now());
        return ResponseEntity.ok(blogRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        return blogRepository.findById(id).map(existing -> {
            String email = authentication != null ? (String) authentication.getPrincipal() : null;
            boolean isOwner = email != null && email.equalsIgnoreCase(existing.getAuthorEmail());
            boolean isAdmin = authentication != null && authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isOwner && !isAdmin) return ResponseEntity.status(403).build();
            blogRepository.delete(existing);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> like(@PathVariable Long id, Authentication authentication) {
        return blogRepository.findById(id).map(existing -> {
            String email = (String) authentication.getPrincipal();
            String csv = existing.getLikedByCsv();
            boolean hasLiked = csv != null && (","+csv+",").contains(","+email+",");
            if (hasLiked) {
                // unlike
                String updated = (","+csv+",").replace(","+email+",", ",").replaceAll("^,|,$", "");
                existing.setLikedByCsv(updated.isEmpty()?null:updated);
                existing.setLikes(Math.max(0, (existing.getLikes()==null?0:existing.getLikes()) - 1));
            } else {
                existing.setLikedByCsv(csv==null? email : (csv+","+email));
                existing.setLikes((existing.getLikes()==null?0:existing.getLikes()) + 1);
            }
            return ResponseEntity.ok(blogRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }
}


