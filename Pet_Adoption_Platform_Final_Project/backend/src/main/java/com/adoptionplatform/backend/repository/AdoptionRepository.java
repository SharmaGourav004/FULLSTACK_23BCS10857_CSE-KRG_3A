package com.adoptionplatform.backend.repository;

import com.adoptionplatform.backend.model.AdoptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdoptionRepository extends JpaRepository<AdoptionRequest, Long> {
    List<AdoptionRequest> findByRequester_IdOrderByCreatedAtDesc(Long requesterId);
    List<AdoptionRequest> findByPet_Id(Long petId);
}


