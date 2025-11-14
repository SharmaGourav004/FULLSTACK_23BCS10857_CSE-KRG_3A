import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import Adoption from "./pages/Adoption";
import Vet from "./pages/Vet";
import Blogs from "./pages/Blogs";
import BlogView from "./pages/BlogView";
import BlogForm from "./components/BlogForm";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPets from "./pages/AdminPets";
import Doctor from "./pages/Doctor";
import DoctorAppointments from "./pages/DoctorAppointments";
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
            <Route path="/doctor" element={<PrivateRoute><Doctor /></PrivateRoute>} />
            <Route path="/doctor/appointments" element={<PrivateRoute><DoctorAppointments /></PrivateRoute>} />
            <Route path="/your-requests" element={<PrivateRoute><YourRequests /></PrivateRoute>} />
            <Route path="/blogs" element={<PrivateRoute><Blogs /></PrivateRoute>} />
            <Route path="/blogs/new" element={<PrivateRoute><BlogForm /></PrivateRoute>} />
            <Route path="/blogs/:id" element={<PrivateRoute><BlogView /></PrivateRoute>} />
            <Route path="/blogs/:id/edit" element={<PrivateRoute><BlogForm /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
