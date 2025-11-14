import { useEffect, useState } from "react";
import { fetchPets, seedPets } from "../api";
import AdoptionForm from "../components/AdoptionForm";

function Adoption() {
  const [pets, setPets] = useState([]);
  const [adoptPet, setAdoptPet] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadPets() {
      try {
        const data = await fetchPets();
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setPets(data);
        } else {
          // Auto-seed if empty
          try {
            await seedPets();
            const seeded = await fetchPets();
            if (mounted && Array.isArray(seeded)) {
              setPets(seeded);
            }
          } catch (seedErr) {
            console.error('Seeding failed:', seedErr);
          }
        }
      } catch (err) {
        console.error('Failed to fetch pets:', err);
        if (mounted) setPets([]);
      }
    }
    loadPets();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Adoption ❤️</h2>
      <p className="text-gray-700 mb-8">Choose a pet below and submit your adoption request.</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pets.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4">
            <img src={p.imageUrl || "https://placehold.co/400x300"} alt={p.name} className="w-full h-40 object-cover rounded" />
            <div className="mt-3">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-500">{p.breed || p.species}</div>
            </div>
            <button onClick={() => setAdoptPet({ id: p.id, name: p.name })} className="mt-3 w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600">Adopt</button>
          </div>
        ))}
        {pets.length === 0 && (
          <div className="col-span-full text-center text-gray-600 py-20 bg-white rounded-xl shadow">
            No pets available right now.
          </div>
        )}
      </div>

      {adoptPet && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 relative">
            <button onClick={() => setAdoptPet(null)} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">✕</button>
            <AdoptionForm pet={adoptPet} onClose={() => setAdoptPet(null)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Adoption;
