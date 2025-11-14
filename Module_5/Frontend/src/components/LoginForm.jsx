import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveAuth } from "../api";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    try {
      const data = await login(email.trim(), password);
      
      if (!data || !data.token) {
        setError('Invalid response from server. Please try again.');
        setLoading(false);
        return;
      }
      
      saveAuth({ 
        token: data.token, 
        role: data.role || 'USER', 
        name: data.name || '', 
        email: data.email || email 
      });
      
      // Navigate without reload for smoother transition
      navigate('/');
      
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please check your credentials and ensure the backend is running.';
      setError(errorMsg);
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white shadow-xl rounded-xl p-8 w-96">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Login</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
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
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div className="text-sm text-center mt-4">
        No account? <button type="button" onClick={()=>navigate('/register')} className="underline">Register</button>
      </div>
    </form>
  );
}

export default LoginForm;
