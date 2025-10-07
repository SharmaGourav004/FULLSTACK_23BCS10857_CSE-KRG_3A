function Vet() {
  return (
    <div className="text-center py-16">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Veterinary Care 🩺</h2>
      <p className="text-gray-700 mb-10 max-w-xl mx-auto">
        Get trusted and affordable veterinary services for your pets. We care for their health and happiness.
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
        {["Checkups", "Vaccination", "Emergency"].map((service) => (
          <div key={service} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-gray-800">{service}</h3>
            <p className="text-gray-600 mt-2">
              Comprehensive {service.toLowerCase()} services available every week.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vet;
