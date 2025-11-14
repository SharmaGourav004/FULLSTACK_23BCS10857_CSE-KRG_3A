import { useEffect, useState } from "react";
import { fetchAdoptions, updateAdoptionStatus, getRole } from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminAdoptions() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = getRole();
    if (!role || role !== 'ADMIN') { 
      navigate('/'); 
      return; 
    }
    load();
  }, [navigate]);

  async function load() {
    setError("");
    try { 
      const data = await fetchAdoptions();
      console.log('Adoption requests fetched:', data);
      setItems(Array.isArray(data) ? data : []); 
    } catch (e) { 
      console.error('Failed to fetch adoptions:', e);
      const errorMsg = e.message || 'Failed to fetch adoption requests';
      setError(errorMsg);
      // Check if it's an authentication/authorization error
      if (errorMsg.includes('403') || errorMsg.includes('Forbidden') || errorMsg.includes('Access Denied')) {
        setError(errorMsg + ' - Please logout and login again as admin to refresh your token.');
      }
    }
  }

  async function setStatus(id, status) {
    try { await updateAdoptionStatus(id, status); await load(); } catch (e) { alert(e.message); }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Admin — Adoption Requests</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <div className="text-red-600 font-semibold mb-2">Error: {error}</div>
          <button 
            onClick={load} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
          <p className="text-sm text-gray-600 mt-2">
            If you see "403 Forbidden" or "Access Denied", please logout and login again to get a new token with admin role.
          </p>
        </div>
      )}
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-blue-50">
              <th className="p-3">ID</th>
              <th className="p-3">Pet</th>
              <th className="p-3">Requester</th>
              <th className="p-3">Message</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.id}</td>
                <td className="p-3">{r.pet?.name}</td>
                <td className="p-3">{r.requester?.email}</td>
                <td className="p-3 max-w-[360px] truncate" title={r.message}>{r.message}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    r.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    r.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  {r.status === 'PENDING' && (
                    <>
                      <button onClick={()=>setStatus(r.id, 'APPROVED')} className="px-3 py-1 bg-emerald-50 border rounded hover:bg-emerald-100">Approve</button>
                      <button onClick={()=>setStatus(r.id, 'REJECTED')} className="px-3 py-1 bg-red-50 border rounded hover:bg-red-100">Reject</button>
                    </>
                  )}
                  {r.status !== 'PENDING' && (
                    <span className="text-gray-500 text-sm">Action completed</span>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td className="p-4 text-gray-500" colSpan={6}>No requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


