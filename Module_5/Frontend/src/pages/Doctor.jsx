import { useEffect, useState } from "react";
import { createAvailability, deleteAvailability, fetchMyAvailability, getRole } from "../api";
import { useNavigate } from "react-router-dom";

export default function Doctor() {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = getRole();
    if (!role || (role !== 'DOCTOR' && role !== 'ADMIN')) { 
      navigate('/'); 
      return; 
    }
    refresh();
  }, [navigate]);

  async function refresh() {
    setLoading(true);
    try { 
      const data = await fetchMyAvailability();
      setSlots(data || []); 
    } catch (e) {
      console.error('Failed to fetch slots:', e);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  async function addSlot() {
    if (!date || !time) {
      alert('Please pick a date and time');
      return;
    }
    try {
      // Create ISO datetime string - use full ISO format with 'Z' for UTC
      const iso = new Date(`${date}T${time}:00`).toISOString();
      console.log('Creating availability at:', iso);
      await createAvailability(iso, Number(duration));
      setDate("");
      setTime("");
      await refresh();
      alert('Slot added successfully!');
    } catch (e) {
      alert('Failed to add slot: ' + (e.message || 'Unknown error'));
      console.error('Add slot error:', e);
    }
  }

  async function removeSlot(id) {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    try {
      await deleteAvailability(id);
      await refresh();
      alert('Slot deleted successfully!');
    } catch (e) {
      alert('Failed to delete slot: ' + (e.message || 'Unknown error'));
      console.error('Delete slot error:', e);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Doctor Portal — Availability</h2>

      <div className="bg-white p-4 rounded shadow mb-6 flex gap-3 items-end">
        <div>
          <label className="block text-sm text-gray-600">Date</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Time</label>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Duration (min)</label>
          <input type="number" value={duration} onChange={e=>setDuration(e.target.value)} className="border p-2 rounded w-28" />
        </div>
        <button onClick={addSlot} className="px-4 py-2 bg-emerald-500 text-white rounded">Add Slot</button>
      </div>

      <div className="bg-white rounded shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading slots...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left bg-blue-50">
                <th className="p-3">Start</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Booked</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {slots.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{new Date(s.startAt).toLocaleString()}</td>
                  <td className="p-3">{s.durationMinutes} min</td>
                  <td className="p-3">{s.booked ? 'Yes' : 'No'}</td>
                  <td className="p-3">
                    {!s.booked && <button onClick={()=>removeSlot(s.id)} className="px-3 py-1 bg-red-50 border rounded hover:bg-red-100">Delete</button>}
                  </td>
                </tr>
              ))}
              {slots.length === 0 && (
                <tr><td className="p-4 text-gray-500 text-center" colSpan={4}>No upcoming availability. Add a slot above.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


