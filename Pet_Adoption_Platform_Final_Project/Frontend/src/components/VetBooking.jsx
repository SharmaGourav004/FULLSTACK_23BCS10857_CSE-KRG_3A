// src/pages/VetBooking.jsx
import { useEffect, useState } from "react";
import { bookByAvailability, cancelVetBooking, fetchAvailability, fetchUserVetBookings, getToken } from "../api";

// If you don't have dayjs installed, either install it or remove dayjs usage.
export default function VetBooking() {
  const [availability, setAvailability] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailability();
    loadUserBookings();
  }, []);

  async function loadAvailability() {
    try {
      const data = await fetchAvailability();
      // Filter out booked appointments and past appointments
      const now = new Date();
      const availableSlots = (data || []).filter(slot => {
        const slotTime = new Date(slot.startAt);
        return !slot.booked && slotTime > now;
      });
      setAvailability(availableSlots);
    } catch (e) {
      console.error('Failed to load availability:', e);
      setAvailability([]);
    }
  }

  async function loadUserBookings() {
    if (!getToken()) return; // Only load if user is logged in
    try {
      const data = await fetchUserVetBookings();
      setUserBookings(data || []);
    } catch (e) {
      console.error('Failed to load user bookings:', e);
      setUserBookings([]);
    }
  }

  async function handleBook() {
    if (!selectedId) {
      alert('Please choose an available slot');
      return;
    }
    if (!getToken()) {
      alert('Please login to book an appointment');
      return;
    }
    if (!phone.trim()) {
      alert('Please provide your phone number');
      return;
    }
    if (phone.trim().length !== 10) {
      alert('Phone number must be exactly 10 digits');
      return;
    }
    if (!message.trim()) {
      alert('Please describe what happened to your pet');
      return;
    }
    setLoading(true);
    try {
      await bookByAvailability(selectedId, phone.trim(), message.trim());
      alert('Booked successfully!');
      setSelectedId(null);
      setPhone("");
      setMessage("");
      await loadAvailability(); // Refresh the list
      await loadUserBookings(); // Refresh user's bookings
    } catch (e) {
      alert('Booking failed: ' + (e.message || 'Unknown error'));
      console.error('Booking error:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId) {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    setLoading(true);
    try {
      await cancelVetBooking(bookingId);
      alert('Appointment cancelled successfully!');
      await loadAvailability(); // Refresh to show the slot is available again
      await loadUserBookings(); // Refresh user's bookings
    } catch (e) {
      alert('Cancellation failed: ' + (e.message || 'Unknown error'));
      console.error('Cancellation error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Vet Booking 🩺</h2>
      <p className="text-gray-600 mb-6">Choose one of the available doctor slots below.</p>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availability.map(a => {
            const isSelected = selectedId === a.id;
            return (
              <button 
                key={a.id} 
                disabled={loading}
                onClick={()=> setSelectedId(a.id)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  isSelected ? 'bg-emerald-500 text-white border-emerald-600' : 
                  'bg-white hover:bg-blue-50'
                }`}>
                <div className="font-semibold">{new Date(a.startAt).toLocaleString()}</div>
                <div className={`text-sm ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                  {a.durationMinutes} min
                </div>
              </button>
            );
          })}
          {availability.length === 0 && (
            <div className="p-6 text-gray-500">No available slots at the moment.</div>
          )}
        </div>

        {selectedId && (
          <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h3 className="font-semibold text-blue-800 mb-3">Booking Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Your Phone Number * (10 digits)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                    if (value.length <= 10) {
                      setPhone(value);
                    }
                  }}
                  placeholder="e.g., 9876543210"
                  maxLength="10"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">What happened to your pet? *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the symptoms or issue..."
                  rows={4}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button 
            onClick={handleBook} 
            disabled={!selectedId || loading}
            className="px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
          <button 
            onClick={() => { setSelectedId(null); }} 
            disabled={loading}
            className="px-4 py-2 bg-blue-50 border rounded-lg disabled:opacity-50">
            Clear
          </button>
        </div>
      </div>

      {/* User's Bookings Section */}
      {getToken() && (
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h3 className="text-2xl font-bold text-emerald-700 mb-4">My Appointments 📋</h3>
          
          {userBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You haven't booked any appointments yet.
            </div>
          ) : (
            <div className="space-y-4">
              {userBookings.map(booking => {
                const bookingDate = new Date(booking.startAt);
                const isPast = bookingDate < new Date();
                
                return (
                  <div 
                    key={booking.id} 
                    className={`p-4 rounded-lg border-2 transition ${
                      isPast 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{isPast ? '✅' : '📅'}</span>
                          <div className={`font-bold text-lg ${isPast ? 'text-gray-600' : 'text-emerald-700'}`}>
                            {bookingDate.toLocaleString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          Duration: {booking.durationMinutes} minutes
                        </div>

                        {booking.doctor && (
                          <div className="mb-2">
                            <span className="text-sm font-semibold text-gray-700">Doctor: </span>
                            <span className="text-sm text-gray-600">{booking.doctor.name}</span>
                          </div>
                        )}

                        {booking.phone && (
                          <div className="mb-2">
                            <span className="text-sm font-semibold text-gray-700">Contact: </span>
                            <span className="text-sm text-blue-600">{booking.phone}</span>
                          </div>
                        )}

                        {booking.message && (
                          <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                            <div className="text-xs font-semibold text-gray-500 mb-1">Reason for Visit:</div>
                            <div className="text-sm text-gray-700">{booking.message}</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isPast 
                            ? 'bg-gray-200 text-gray-600' 
                            : 'bg-emerald-200 text-emerald-700'
                        }`}>
                          {isPast ? 'Completed' : 'Upcoming'}
                        </div>
                        
                        {!isPast && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={loading}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
