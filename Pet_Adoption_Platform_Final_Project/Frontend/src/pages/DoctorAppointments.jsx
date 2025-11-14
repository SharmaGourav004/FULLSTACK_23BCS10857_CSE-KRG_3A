import { useEffect, useState } from "react";
import { fetchMyVetBookings, getRole } from "../api";
import { useNavigate } from "react-router-dom";

export default function DoctorAppointments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = getRole();
    if (!role || (role !== 'DOCTOR' && role !== 'ADMIN')) { 
      navigate('/'); 
      return; 
    }
    loadBookings();
  }, [navigate]);

  async function loadBookings() {
    setLoading(true);
    try {
      const data = await fetchMyVetBookings();
      setBookings(data || []);
    } catch (e) {
      console.error('Failed to fetch bookings:', e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();
  const futureAppointments = bookings.filter(b => new Date(b.startAt) > now);
  const pastAppointments = bookings.filter(b => new Date(b.startAt) <= now);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">My Appointments 📅</h2>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading appointments...</div>
      ) : (
        <>
          {/* Future Appointments */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-semibold text-emerald-600 mb-4 flex items-center gap-2">
              <span>🔔</span> Future Appointments ({futureAppointments.length})
            </h3>
            {futureAppointments.length === 0 && (
              <div className="text-gray-500 text-center py-8">No upcoming appointments.</div>
            )}
            <div className="space-y-4">
              {futureAppointments.map(b => (
                <div key={b.id} className="p-5 border-2 border-emerald-200 rounded-lg bg-emerald-50 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🕐</span>
                        <div className="font-bold text-xl text-gray-800">
                          {new Date(b.startAt).toLocaleString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">Duration: {b.durationMinutes} minutes</div>
                      
                      <div className="bg-white rounded-lg p-4 border border-emerald-200">
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Patient Name</div>
                            <div className="font-semibold text-gray-800">{b.user?.name || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Email</div>
                            <div className="text-sm text-gray-700">{b.user?.email || '-'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Phone Number</div>
                            <div className="font-semibold text-blue-600 flex items-center gap-1">
                              <span>📞</span>
                              <span>{b.phone || 'Not provided'}</span>
                            </div>
                          </div>
                        </div>
                        
                        {b.message && (
                          <div className="mt-3 pt-3 border-t border-emerald-100">
                            <div className="text-xs text-gray-500 mb-1">Reason / Pet Issue</div>
                            <div className="text-sm text-gray-700 bg-amber-50 p-3 rounded border border-amber-200">
                              {b.message}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Appointments */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-600 mb-4 flex items-center gap-2">
              <span>✅</span> Past Appointments ({pastAppointments.length})
            </h3>
            {pastAppointments.length === 0 && (
              <div className="text-gray-500 text-center py-8">No past appointments.</div>
            )}
            <div className="space-y-4">
              {pastAppointments.map(b => (
                <div key={b.id} className="p-5 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🕐</span>
                        <div className="font-bold text-lg text-gray-700">
                          {new Date(b.startAt).toLocaleString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mb-3">Duration: {b.durationMinutes} minutes</div>
                      
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Patient Name</div>
                            <div className="font-semibold text-gray-700">{b.user?.name || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Email</div>
                            <div className="text-sm text-gray-600">{b.user?.email || '-'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Phone Number</div>
                            <div className="font-semibold text-blue-600 flex items-center gap-1">
                              <span>📞</span>
                              <span>{b.phone || 'Not provided'}</span>
                            </div>
                          </div>
                        </div>
                        
                        {b.message && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Reason / Pet Issue</div>
                            <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded border border-gray-300">
                              {b.message}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
