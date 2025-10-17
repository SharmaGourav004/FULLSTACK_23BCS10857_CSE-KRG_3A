import { Link } from "react-router-dom";

function Navbar() {
  const email = localStorage.getItem("email");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-600 text-white px-8 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-wide">🐾 Pet Adoption</h1>
      
      <div className="flex gap-6 text-lg items-center">
        <Link className="hover:text-amber-300 transition" to="/">Home</Link>
        {!email ? (
          <>
            <Link className="hover:text-amber-300 transition" to="/login">Login</Link>
            <Link className="hover:text-amber-300 transition" to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="italic text-sm">{email}</span>
            <button onClick={handleLogout} className="hover:text-amber-300">Logout</button>
          </>
        )}
        <Link className="hover:text-amber-300 transition" to="/pets">Pets</Link>
        <Link className="hover:text-amber-300 transition" to="/adoption">Adoption</Link>
        <Link className="hover:text-amber-300 transition" to="/vet">Vet</Link>
        <Link className="hover:text-amber-300 transition" to="/blogs">Blogs</Link>
      </div>
    </nav>
  );
}

export default Navbar;
