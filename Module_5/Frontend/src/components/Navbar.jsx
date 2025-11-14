import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getToken, logout, getRole } from "../api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(getToken());
  const [role, setRole] = useState(getRole());

  // Update token and role when location changes (after navigation)
  useEffect(() => {
    setToken(getToken());
    setRole(getRole());
  }, [location]);

  const handleLogout = () => {
    logout();
    setToken(null);
    setRole(null);
    navigate('/');
  };

  // Helper function to get link className with active state
  const getLinkClass = (path) => {
    const isActive = location.pathname === path || 
                     (path === '/login' && location.pathname === '/register');
    return isActive 
      ? "bg-white text-blue-600 px-3 py-1 rounded transition" 
      : "hover:text-amber-300 transition";
  };

  return (
    <nav className="bg-blue-600 text-white px-8 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-wide">🐾 Pet Adoption</h1>
      
      <div className="flex gap-6 text-lg">
        {/* Hide site-wide links for DOCTOR role since doctors should not access these sections */}
        {role !== 'DOCTOR' && (
          <>
            <Link className={getLinkClass('/')} to="/">Home</Link>
            <Link className={getLinkClass('/pets')} to="/pets">Pets/Adoption</Link>
            <Link className={getLinkClass('/vet')} to="/vet">Vet</Link>
            <Link className={getLinkClass('/blogs')} to="/blogs">Blogs</Link>
            {token && role !== 'ADMIN' && <Link className={getLinkClass('/your-requests')} to="/your-requests">Your Requests</Link>}
          </>
        )}
        {role === 'ADMIN' && <Link className={getLinkClass('/admin/pets')} to="/admin/pets">Add Pets</Link>}
        {role === 'ADMIN' && <Link className={getLinkClass('/admin/adoptions')} to="/admin/adoptions">Adoption Requests</Link>}
        {role === 'DOCTOR' && <Link className={getLinkClass('/doctor')} to="/doctor">Add Appointments</Link>}
        {role === 'DOCTOR' && <Link className={getLinkClass('/doctor/appointments')} to="/doctor/appointments">My Appointments</Link>}
        {!token && <Link className={getLinkClass('/login')} to="/login">Login / Register</Link>}
        {token && <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium">Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;
