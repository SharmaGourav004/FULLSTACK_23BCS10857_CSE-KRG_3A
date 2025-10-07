function Pets() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Available Pets 🐾</h2>
      <p className="text-gray-700 mb-10">
        Browse through our lovely animals waiting for a new home.
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {["Bella", "Charlie", "Max", "Luna"].map((pet) => (
          <div key={pet} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition">
            <img
              src={`https://placekitten.com/300/200`}
              alt={pet}
              className="rounded-lg mb-3 w-full h-48 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800">{pet}</h3>
            <button className="mt-3 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition">
              Adopt Me
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pets;
