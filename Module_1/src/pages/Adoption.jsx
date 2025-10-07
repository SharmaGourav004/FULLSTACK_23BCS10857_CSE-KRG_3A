function Adoption() {
  return (
    <div className="text-center py-16">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Adoption Process ❤️</h2>
      <p className="text-gray-700 mb-10 max-w-xl mx-auto">
        Learn how easy it is to adopt your new furry friend! We ensure a smooth and caring adoption journey.
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {["Choose a Pet", "Meet & Bond", "Complete Paperwork", "Bring Home"].map((step, i) => (
          <div key={i} className="bg-white shadow-lg rounded-xl p-6 w-60 hover:shadow-2xl transition">
            <span className="text-amber-400 text-4xl font-bold">{i + 1}</span>
            <h3 className="mt-2 font-semibold text-lg text-gray-800">{step}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Adoption;
