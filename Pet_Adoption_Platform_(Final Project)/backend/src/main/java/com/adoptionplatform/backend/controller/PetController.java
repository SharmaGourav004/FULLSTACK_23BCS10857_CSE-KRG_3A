package com.adoptionplatform.backend.controller;

import com.adoptionplatform.backend.model.Pet;
import com.adoptionplatform.backend.repository.PetRepository;
import com.adoptionplatform.backend.repository.AdoptionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetRepository petRepository;
    private final AdoptionRepository adoptionRepository;

    public PetController(PetRepository petRepository, AdoptionRepository adoptionRepository) {
        this.petRepository = petRepository;
        this.adoptionRepository = adoptionRepository;
    }

    @GetMapping
    public List<Pet> all() { return petRepository.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> byId(@PathVariable Long id) {
        return petRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Pet create(@RequestBody Pet pet) { return petRepository.save(pet); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Pet> update(@PathVariable Long id, @RequestBody Pet pet) {
        return petRepository.findById(id)
                .map(existing -> {
                    existing.setName(pet.getName());
                    existing.setSpecies(pet.getSpecies());
                    existing.setBreed(pet.getBreed());
                    existing.setAge(pet.getAge());
                    existing.setGender(pet.getGender());
                    existing.setDescription(pet.getDescription());
                    existing.setImageUrl(pet.getImageUrl());
                    existing.setAvailable(pet.isAvailable());
                    existing.setLocation(pet.getLocation());
                    return ResponseEntity.ok(petRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!petRepository.existsById(id)) return ResponseEntity.notFound().build();
        
        // Delete all adoption requests for this pet first to avoid foreign key constraint violation
        adoptionRepository.deleteAll(adoptionRepository.findByPet_Id(id));
        
        // Now delete the pet
        petRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


