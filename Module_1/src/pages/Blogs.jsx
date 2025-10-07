function Blogs() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Latest Blogs ✍️</h2>
      <p className="text-gray-700 mb-8">Stories and tips about pet adoption and care.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
            <img
              src={`https://place-puppy.com/400x25${n}`}
              alt="Blog"
              className="rounded-lg mb-3 h-48 w-full object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Caring for Your Pet #{n}
            </h3>
            <p className="text-gray-600 text-sm">
              Discover essential tips for maintaining your pet’s health and happiness.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;
