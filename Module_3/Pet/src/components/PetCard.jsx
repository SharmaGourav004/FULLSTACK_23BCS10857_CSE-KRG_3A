// src/components/PetCard.jsx
export default function PetCard({ pet, onView, onAdopt }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
      <div className="relative">
        <img src={pet.img} alt={pet.name} className="w-full h-44 object-cover" />
        <div className="absolute left-3 top-3 bg-amber-400 text-white text-sm px-2 py-1 rounded-md font-semibold">
          {pet.type}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{pet.name}</h3>
        <p className="text-sm text-gray-500">{pet.breed} • {pet.age}</p>
        <p className="mt-3 text-gray-600 text-sm">{pet.description}</p>
        <div className="mt-4 flex gap-3">
          <button onClick={onView} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">View</button>
          <button onClick={onAdopt} className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition">Adopt</button>
        </div>
      </div>
    </div>
  );
}
