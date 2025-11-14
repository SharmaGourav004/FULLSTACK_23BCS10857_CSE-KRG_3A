import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      const result = await register(name.trim(), email.trim(), password);
      setSuccess('Account created successfully! Redirecting to Login...');
      setTimeout(() => {
        navigate('/login');
        setLoading(false);
      }, 1500);
    } catch (err) {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      console.error('Registration error:', err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white shadow-xl rounded-xl p-8 w-96">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Register</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Full Name"
        required
        className="w-full mb-4 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        required
        className="w-full mb-4 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <div className="relative mb-6">
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
      <div className="text-sm text-center mt-4">
        Already have an account? <button type="button" onClick={()=>navigate('/login')} className="underline">Login</button>
      </div>
    </form>
  );
}

export default RegisterForm;
