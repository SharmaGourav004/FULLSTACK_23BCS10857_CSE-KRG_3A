import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const handleView = () => {
    navigate('/pets');
  };
  return (
    <div className="text-center py-20 bg-gradient-to-b from-sky-50 to-sky-100">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-6">
        Welcome to Pet Adoption Platform 🐶🐱
      </h1>
      <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
        Find your perfect pet companion today! Adopt a loving furry friend and make your home happier.
      </p>
      <button onClick={handleView} className="bg-amber-400 hover:bg-amber-500 text-white px-6 py-3 rounded-lg shadow-md transition">
        View Available Pets
      </button>
    </div>
  );
}

export default Home;
