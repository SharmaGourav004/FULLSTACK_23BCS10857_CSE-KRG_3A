// src/pages/VetBooking.jsx
import { useState } from "react";
import dayjs from "dayjs"; // optional: if you don't want to add dayjs, the code below still works using Date

// If you don't have dayjs installed, either install it or remove dayjs usage.
export default function VetBooking() {
  // generate next 10 days
  const days = Array.from({length: 10}).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      key: i,
      date,
      label: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  const timeSlots = ["09:00", "10:00", "11:30", "13:00", "15:00", "16:30", "18:00"];
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booked, setBooked] = useState([]);

  function handleBook() {
    if (selectedSlot == null) return alert("Choose a time slot first.");
    const day = days[selectedDayIndex];
    const id = `${day.label} ${selectedSlot}`;
    setBooked((b) => [...b, id]);
    alert(`Booked: ${day.label} at ${selectedSlot} (demo)`);
    setSelectedSlot(null);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Vet Booking 🩺</h2>
      <p className="text-gray-600 mb-6">Choose a date and an available time slot for your pet's appointment.</p>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex overflow-x-auto gap-3 pb-3">
          {days.map((d, i) => (
            <button
              key={i}
              onClick={() => { setSelectedDayIndex(i); setSelectedSlot(null); }}
              className={`min-w-[110px] p-3 rounded-lg text-left ${selectedDayIndex === i ? 'bg-blue-600 text-white' : 'bg-blue-50'} hover:scale-[1.02] transition`}
            >
              <div className="text-sm">{d.label}</div>
              <div className="text-xs text-gray-500">{d.date.toLocaleDateString()}</div>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Available time slots</h3>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((t) => {
              const id = `${days[selectedDayIndex].label} ${t}`;
              const isBooked = booked.includes(id);
              return (
                <button
                  key={t}
                  onClick={() => !isBooked && setSelectedSlot(t)}
                  disabled={isBooked}
                  className={`p-3 rounded-lg border ${isBooked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : selectedSlot === t ? 'bg-emerald-500 text-white' : 'bg-white hover:bg-blue-50'} transition`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={handleBook} className="px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500">Book Appointment</button>
            <button onClick={() => { setSelectedSlot(null); }} className="px-4 py-2 bg-blue-50 border rounded-lg">Clear</button>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-700">Your bookings (demo)</h4>
            {booked.length === 0 ? (
              <p className="text-gray-500">No bookings yet.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {booked.map((b, idx) => (
                  <li key={idx} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                    <span>{b}</span>
                    <span className="text-sm text-gray-500">Demo</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
