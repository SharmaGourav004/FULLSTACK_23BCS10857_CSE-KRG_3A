// src/pages/Pets.jsx
import { useState, useMemo, useEffect } from "react";
import PetCard from "../components/PetCard";
import SearchFilter from "../components/SearchFilter";
import AdoptionForm from "../components/AdoptionForm";
import { fetchPets, seedPets } from "../api";

export default function Pets() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ type: "All", sex: "All", location: "" });
  const [selectedPet, setSelectedPet] = useState(null);
  const [showAdoptFormFor, setShowAdoptFormFor] = useState(null);

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadPets() {
      try {
        const data = await fetchPets();
        if (mounted && Array.isArray(data) && data.length > 0) {
          setPets(data.map(p => ({
            id: p.id,
            name: p.name,
            type: p.species || p.type,
            age: p.age ? `${p.age} yrs` : '',
            sex: p.gender || 'Unknown',
            breed: p.breed,
            img: p.imageUrl || 'https://placehold.co/400x300',
            description: p.description,
            location: p.location
          })));
        } else if (mounted && Array.isArray(data) && data.length === 0) {
          // Auto-seed if empty
          try { 
            await seedPets(); 
            // Refetch after seeding
            const seeded = await fetchPets();
            if (mounted && Array.isArray(seeded)) {
              setPets(seeded.map(p => ({
                id: p.id,
                name: p.name,
                type: p.species || p.type,
                age: p.age ? `${p.age} yrs` : '',
                sex: p.gender || 'Unknown',
                breed: p.breed,
                img: p.imageUrl || 'https://placehold.co/400x300',
                description: p.description,
                location: p.location
              })));
            }
          } catch (seedErr) {
            console.error('Seeding failed:', seedErr);
          }
        }
      } catch (err) {
        console.error('Failed to fetch pets:', err);
        // Try to seed and retry
        try {
          await seedPets();
          const data = await fetchPets();
          if (mounted && Array.isArray(data)) {
            setPets(data.map(p => ({
              id: p.id,
              name: p.name,
              type: p.species || p.type,
              age: p.age ? `${p.age} yrs` : '',
              sex: p.gender || 'Unknown',
              breed: p.breed,
              img: p.imageUrl || 'https://placehold.co/400x300',
              description: p.description,
              location: p.location
            })));
          }
        } catch {}
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadPets();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    return pets.filter((p) => {
      if (filters.type !== "All" && p.type !== filters.type) return false;
      if (filters.sex !== "All" && p.sex !== filters.sex) return false;
      if (filters.location && p.location !== filters.location) return false;
      if (query && !`${p.name} ${p.breed} ${p.description} ${p.location||''}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, filters, pets]);

  // Extract unique species and locations from pets data
  const availableSpecies = useMemo(() => {
    const species = [...new Set(pets.map(p => p.type).filter(Boolean))];
    return species.sort();
  }, [pets]);

  const availableLocations = useMemo(() => {
    const locations = [...new Set(pets.map(p => p.location).filter(Boolean))];
    return locations.sort();
  }, [pets]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Pets / Adoption 🐾</h2>
          <div className="text-center py-20">Loading pets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Pets / Adoption 🐾</h2>

        <SearchFilter
          query={query}
          onQuery={setQuery}
          filters={filters}
          onFilter={setFilters}
          availableSpecies={availableSpecies}
          availableLocations={availableLocations}
        />

        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onView={() => setSelectedPet(pet)}
              onAdopt={() => setShowAdoptFormFor(pet)}
            />
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-600 py-20 bg-white rounded-xl shadow">
              No pets matched your search/filters.
            </div>
          )}
        </div>
      </div>

      {/* Pet Details Modal */}
      {selectedPet && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 md:w-3/4 lg:w-2/3 p-6 relative">
            <button onClick={() => setSelectedPet(null)} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">✕</button>
            <div className="flex flex-col md:flex-row gap-6">
              <img src={selectedPet.img} alt={selectedPet.name} className="w-full md:w-1/2 h-72 object-contain bg-gray-100 rounded-lg" />
              <div>
                <h3 className="text-2xl font-bold text-blue-700">{selectedPet.name}</h3>
                <p className="text-gray-600">{selectedPet.breed} • {selectedPet.age} • {selectedPet.sex}</p>
                <p className="mt-4 text-gray-700">{selectedPet.description}</p>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => { setShowAdoptFormFor(selectedPet); setSelectedPet(null); }}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white">Adopt</button>
                  <button onClick={() => setSelectedPet(null)} className="px-4 py-2 rounded-lg bg-blue-50 border">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adoption form modal */}
      {showAdoptFormFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 relative">
            <button onClick={() => setShowAdoptFormFor(null)} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">✕</button>
            <AdoptionForm pet={showAdoptFormFor} onClose={() => setShowAdoptFormFor(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
