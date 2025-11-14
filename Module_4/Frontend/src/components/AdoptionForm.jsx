// src/components/AdoptionForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postAdoption, getToken, getUser } from "../api";

export default function AdoptionForm({ pet, onClose }) {
  const [form, setForm] = useState({ phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    setUser(getUser());
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    setSubmitted(true);
    const message = form.message ? `${form.message}\nPhone: ${form.phone || 'Not provided'}` : `Phone: ${form.phone || 'Not provided'}`;
    postAdoption(pet.id, message)
      .then(() => {
        setTimeout(() => { 
          onClose(); 
          alert(`Adoption request submitted for ${pet.name}! We'll contact you soon.`); 
        }, 700);
      })
      .catch((err) => {
        setSubmitted(false);
        alert('Failed to submit: ' + (err.message || 'Please try again'));
      });
  }

  if (submitted) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-blue-700">Thanks!</h3>
        <p className="text-gray-600 mt-2">Your adoption request has been submitted.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Please wait...</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-blue-700 mb-2">Adopt {pet.name} 🐾</h3>
      <p className="text-sm text-gray-600 mb-4">
        Hello {user.name || user.email}! Please provide your contact details below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="p-2 bg-blue-50 rounded text-sm text-gray-700">
          <strong>Your Email:</strong> {user.email}
        </div>

        <input 
          value={form.phone} 
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Only allow digits
            if (value.length <= 10) {
              setForm({...form, phone: value});
            }
          }}
          placeholder="Phone Number (10 digits)" 
          type="tel"
          maxLength="10"
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-300" 
        />

        <textarea 
          value={form.message} 
          onChange={(e) => setForm({...form, message: e.target.value})}
          rows="4" 
          placeholder="Message / Why you'd be a great pet parent..." 
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-300" 
        />

        <div className="flex gap-3">
          <button type="submit" disabled={submitted} className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 disabled:opacity-50">
            {submitted ? 'Submitting...' : 'Submit Request'}
          </button>
          <button type="button" onClick={onClose} className="flex-1 bg-blue-50 border rounded-lg">Cancel</button>
        </div>
      </form>
    </div>
  );
}
