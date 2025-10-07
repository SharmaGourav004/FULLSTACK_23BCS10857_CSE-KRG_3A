import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-8 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-wide">🐾 Pet Adoption</h1>
      
      <div className="flex gap-6 text-lg">
        <Link className="hover:text-amber-300 transition" to="/">Home</Link>
        <Link className="hover:text-amber-300 transition" to="/login">Login</Link>
        <Link className="hover:text-amber-300 transition" to="/register">Register</Link>
        <Link className="hover:text-amber-300 transition" to="/pets">Pets</Link>
        <Link className="hover:text-amber-300 transition" to="/adoption">Adoption</Link>
        <Link className="hover:text-amber-300 transition" to="/vet">Vet</Link>
        <Link className="hover:text-amber-300 transition" to="/blogs">Blogs</Link>
      </div>
    </nav>
  );
}

export default Navbar;
