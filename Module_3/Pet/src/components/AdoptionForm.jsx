// src/components/AdoptionForm.jsx
import { useState } from "react";

export default function AdoptionForm({ pet, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // simulate success (no backend)
    setSubmitted(true);
    setTimeout(() => {
      // auto-close after small delay
      onClose();
      alert(`Adoption request submitted for ${pet.name}! (demo)`);
    }, 900);
  }

  if (submitted) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-blue-700">Thanks!</h3>
        <p className="text-gray-600 mt-2">Your adoption request has been submitted.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-blue-700 mb-2">Adopt {pet.name} 🐾</h3>
      <p className="text-sm text-gray-600 mb-4">Please fill this form. We'll contact you to proceed.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
          required placeholder="Full name" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-300" />

        <input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
          required type="email" placeholder="Email" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-300" />

        <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
          required placeholder="Phone" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-300" />

        <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
          rows="3" placeholder="Message / why you'd be a great parent" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-300" />

        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600">Submit Request</button>
          <button type="button" onClick={onClose} className="flex-1 bg-blue-50 border rounded-lg">Cancel</button>
        </div>
      </form>
    </div>
  );
}
