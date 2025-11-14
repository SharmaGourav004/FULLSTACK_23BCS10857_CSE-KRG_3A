package com.adoptionplatform.backend.repository;

import com.adoptionplatform.backend.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<Pet, Long> {}


