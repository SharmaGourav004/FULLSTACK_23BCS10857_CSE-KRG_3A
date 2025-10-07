// src/pages/Pets.jsx
import { useState, useMemo } from "react";
import PetCard from "../components/PetCard";
import SearchFilter from "../components/SearchFilter";
import AdoptionForm from "../components/AdoptionForm";

const DUMMY_PETS = [
  { id: 1, name: "Bella", type: "Cat", age: "2 years", sex: "Female", breed: "Siamese", img: "https://placekitten.com/400/300", description: "Playful and cuddly." },
  { id: 2, name: "Charlie", type: "Dog", age: "3 years", sex: "Male", breed: "Beagle", img: "https://placehold.co/400x300?text=Dog", description: "Loves walks and treats." },
  { id: 3, name: "Luna", type: "Cat", age: "1 year", sex: "Female", breed: "Maine Coon", img: "https://placekitten.com/401/300", description: "Gentle giant." },
  { id: 4, name: "Max", type: "Dog", age: "4 years", sex: "Male", breed: "Labrador", img: "https://placehold.co/401x300?text=Dog", description: "Loyal and friendly." },
  { id: 5, name: "Milo", type: "Dog", age: "6 months", sex: "Male", breed: "Mixed", img: "https://placehold.co/402x300?text=Dog", description: "Energetic puppy." },
  { id: 6, name: "Coco", type: "Cat", age: "5 years", sex: "Female", breed: "Persian", img: "https://placekitten.com/402/300", description: "Calm lap-cat." },
];

export default function Pets() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ type: "All", sex: "All" });
  const [selectedPet, setSelectedPet] = useState(null);
  const [showAdoptFormFor, setShowAdoptFormFor] = useState(null);

  const filtered = useMemo(() => {
    return DUMMY_PETS.filter((p) => {
      if (filters.type !== "All" && p.type !== filters.type) return false;
      if (filters.sex !== "All" && p.sex !== filters.sex) return false;
      if (query && !`${p.name} ${p.breed} ${p.description}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, filters]);

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Available Pets 🐾</h2>

        <SearchFilter
          query={query}
          onQuery={setQuery}
          filters={filters}
          onFilter={setFilters}
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
              <img src={selectedPet.img} alt={selectedPet.name} className="w-full md:w-1/2 h-72 object-cover rounded-lg" />
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
