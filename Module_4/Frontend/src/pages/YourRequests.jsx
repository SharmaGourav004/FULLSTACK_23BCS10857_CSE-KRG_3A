import { useEffect, useState } from "react";
import { fetchAdoptions, getToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function YourRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    // Small delay to ensure token is available
    const timer = setTimeout(() => {
      loadRequests();
    }, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  async function loadRequests() {
    setLoading(true);
    setError("");
    try {
      console.log('Loading user requests...');
      console.log('Token:', getToken() ? 'Present' : 'Missing');
      const data = await fetchAdoptions();
      console.log('Received data type:', typeof data);
      console.log('Received data:', data);
      console.log('Is array?', Array.isArray(data));
      if (Array.isArray(data)) {
        setRequests(data);
        console.log('Set requests count:', data.length);
      } else if (data && typeof data === 'object') {
        // Check if it's an error object
        if (data.error) {
          throw new Error(data.error);
        }
        console.warn('Data is not an array:', data);
        setRequests([]);
      } else {
        console.warn('Data is not an array:', data);
        setRequests([]);
      }
    } catch (e) {
      console.error('Failed to fetch requests:', e);
      console.error('Error details:', {
        message: e.message,
        stack: e.stack,
        name: e.name
      });
      setError(e.message || 'Failed to fetch your adoption requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  function getStatusMessage(status) {
    switch (status) {
      case 'APPROVED':
        return '✅ Your adoption request has been approved! Our team will contact you soon.';
      case 'REJECTED':
        return '❌ Your adoption request has been rejected. Please contact us for more information.';
      case 'PENDING':
        return '⏳ Your adoption request is pending review. We will update you soon.';
      default:
        return '';
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-700">Your Adoption Requests</h2>
        <button
          onClick={loadRequests}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <div className="text-red-600 font-semibold mb-2">Error: {error}</div>
          <button 
            onClick={loadRequests}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading your requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center">
          <p className="text-gray-600 text-lg">You haven't submitted any adoption requests yet.</p>
          <button 
            onClick={() => navigate('/adoption')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Browse Pets & Submit Request
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {request.pet?.name || 'Unknown Pet'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {request.pet?.breed && `${request.pet.breed} • `}
                    {request.pet?.species || ''}
                  </p>
                  {request.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span className={`px-4 py-2 rounded-full border font-semibold ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>

              {request.message && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Your Message:</strong> {request.message}
                  </p>
                </div>
              )}

              <div className={`p-4 rounded-lg border-l-4 ${
                request.status === 'APPROVED' ? 'bg-green-50 border-green-400' :
                request.status === 'REJECTED' ? 'bg-red-50 border-red-400' :
                'bg-yellow-50 border-yellow-400'
              }`}>
                <p className="font-medium text-gray-800">
                  {getStatusMessage(request.status)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

