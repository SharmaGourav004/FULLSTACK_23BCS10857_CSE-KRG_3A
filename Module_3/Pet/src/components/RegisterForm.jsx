import { useState } from "react";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Registration failed");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white shadow-xl rounded-xl p-8 w-96">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Register</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Full Name"
        className="w-full mb-4 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        className="w-full mb-4 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="w-full mb-6 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition">
        Create Account
      </button>
    </form>
  );
}

export default RegisterForm;
