function RegisterForm() {
  return (
    <form className="bg-white shadow-xl rounded-xl p-8 w-96">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Register</h2>
      <input
        type="text"
        placeholder="Full Name"
        className="w-full mb-4 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-4 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <input
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
