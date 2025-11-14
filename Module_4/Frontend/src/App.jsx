import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import Adoption from "./pages/Adoption";
import Vet from "./pages/Vet";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPets from "./pages/AdminPets";
import AdminAdoptions from "./pages/AdminAdoptions";
import YourRequests from "./pages/YourRequests";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/adoption" element={<PrivateRoute><Adoption /></PrivateRoute>} />
            <Route path="/vet" element={<PrivateRoute><Vet /></PrivateRoute>} />
            <Route path="/admin/pets" element={<PrivateRoute requiredRole="ADMIN"><AdminPets /></PrivateRoute>} />
            <Route path="/admin/adoptions" element={<PrivateRoute requiredRole="ADMIN"><AdminAdoptions /></PrivateRoute>} />
            <Route path="/your-requests" element={<PrivateRoute><YourRequests /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
