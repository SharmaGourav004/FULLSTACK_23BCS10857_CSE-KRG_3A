import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import Adoption from "./pages/Adoption";
import Vet from "./pages/Vet";
import Blogs from "./pages/Blogs";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/vet" element={<Vet />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
