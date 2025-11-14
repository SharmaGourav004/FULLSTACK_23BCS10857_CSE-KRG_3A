package com.adoptionplatform.backend.repository;

import com.adoptionplatform.backend.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<BlogPost, Long> {}


