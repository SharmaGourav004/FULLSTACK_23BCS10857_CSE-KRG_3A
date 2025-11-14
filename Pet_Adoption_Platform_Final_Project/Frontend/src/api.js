const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

// Log API base for debugging
console.log('API Base URL:', API_BASE);

export { API_BASE };

export async function login(email, password) {
  try {
    const url = `${API_BASE}/api/auth/login`;
    console.log('Login request to:', url);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    console.log('Login response status:', res.status, res.statusText);
    
    const contentType = res.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.error('Login error response:', text);
      throw new Error(text || 'Login failed');
    }
    
    if (!res.ok) {
      const errorMsg = data.error || data.message || 'Login failed. Please check your credentials.';
      console.error('Login failed:', errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('Login successful');
    return data;
  } catch (err) {
    console.error('Login exception:', err);
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Failed to connect to server. Please ensure the backend is running on http://localhost:8080');
    }
    if (err instanceof Error && err.message) {
      throw err;
    }
    throw new Error('Failed to connect to server. Please ensure the backend is running.');
  }
}

export async function register(name, email, password) {
  try {
    const url = `${API_BASE}/api/auth/register`;
    console.log('Register request to:', url);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    console.log('Register response status:', res.status, res.statusText);
    
    const contentType = res.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.error('Register error response:', text);
      throw new Error(text || 'Registration failed');
    }
    
    if (!res.ok) {
      const errorMsg = data.message || data.error || 'Registration failed. Please try again.';
      console.error('Register failed:', errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('Register successful');
    return data;
  } catch (err) {
    console.error('Register exception:', err);
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Failed to connect to server. Please ensure the backend is running on http://localhost:8080');
    }
    if (err instanceof Error && err.message) {
      throw err;
    }
    throw new Error('Failed to connect to server. Please ensure the backend is running.');
  }
}

export async function fetchPets() {
  const res = await fetch(`${API_BASE}/api/pets`);
  if (!res.ok) throw new Error('Failed to fetch pets');
  return res.json();
}

export function saveAuth({ token, role, name, email }) {
  if (token) localStorage.setItem('token', token);
  if (role) localStorage.setItem('role', role);
  if (name) localStorage.setItem('name', name);
  if (email) localStorage.setItem('email', email);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getRole() {
  return localStorage.getItem('role');
}

export function getUser() {
  return {
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role')
  };
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
  localStorage.removeItem('email');
}

// Pets admin
export async function createPet(pet) {
  const token = getToken();
  const headers = {
      'Content-Type': 'application/json'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/pets`, {
    method: 'POST',
    headers,
    body: JSON.stringify(pet)
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to create pet');
  return res.json();
}

export async function updatePet(id, pet) {
  const token = getToken();
  const headers = {
      'Content-Type': 'application/json'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/pets/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(pet)
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to update pet');
  return res.json();
}

export async function deletePet(id) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/pets/${id}`, {
    method: 'DELETE',
    headers
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to delete pet');
  return true;
}

// Vet availability
export async function fetchAvailability(doctorId = null, mySlots = false) {
  const url = new URL(`${API_BASE}/api/vet/availability`);
  if (doctorId) {
    url.searchParams.set('doctorId', String(doctorId));
  }
  if (mySlots) {
    url.searchParams.set('mySlots', 'true');
    const token = getToken();
    if (token) {
      // Note: We'll need to pass the token in the Authorization header
      // The fetchAvailability function should accept auth token
    }
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch availability');
  return res.json();
}

// Fetch availability with authentication (for doctor's own slots)
export async function fetchMyAvailability() {
  const token = getToken();
  const url = new URL(`${API_BASE}/api/vet/availability`);
  url.searchParams.set('mySlots', 'true');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error('Failed to fetch availability');
  return res.json();
}

// Fetch doctor's own vet bookings/appointments
export async function fetchMyVetBookings() {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required. Please login.');
  }
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };
  const res = await fetch(`${API_BASE}/api/vet/appointments/mine`, { headers });
  if (!res.ok) throw new Error('Failed to fetch your bookings');
  return res.json();
}

// Fetch user's own vet bookings (appointments the user has booked)
export async function fetchUserVetBookings() {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required. Please login.');
  }
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };
  const res = await fetch(`${API_BASE}/api/vet/appointments/user`, { headers });
  if (!res.ok) throw new Error('Failed to fetch your bookings');
  return res.json();
}

export async function createAvailability(startAtIso, durationMinutes = 30) {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required. Please login.');
  }
  const url = new URL(`${API_BASE}/api/vet/availability`);
  url.searchParams.set('at', startAtIso);
  url.searchParams.set('duration', String(durationMinutes));
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers
  });
  if (!res.ok) {
    let errorMsg = 'Failed to create availability';
    try {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        errorMsg = data.error || data.message || errorMsg;
      } else {
        const text = await res.text();
        errorMsg = text || errorMsg;
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function deleteAvailability(id) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/vet/availability/${id}`, {
    method: 'DELETE',
    headers
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to delete availability');
  return true;
}

export async function bookByAvailability(availabilityId, phone, message) {
  const token = getToken();
  const url = new URL(`${API_BASE}/api/vet/appointments`);
  url.searchParams.set('availabilityId', String(availabilityId));
  if (phone) url.searchParams.set('phone', phone);
  if (message) url.searchParams.set('message', encodeURIComponent(message));
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to book appointment');
  return res.json();
}

export async function cancelVetBooking(bookingId) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/vet/appointments/${bookingId}`, {
    method: 'DELETE',
    headers
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to cancel appointment');
  return true;
}

export async function postAdoption(petId, message) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/adoptions?petId=${petId}&message=${encodeURIComponent(message)}`, {
    method: 'POST',
    headers
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to submit adoption request');
  }
  return res.json();
}

export async function fetchAdoptions() {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required. Please login.');
  }
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  const url = `${API_BASE}/api/adoptions`;
  console.log('Fetching adoptions from:', url);
  console.log('Token present:', !!token);
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers
    });
    
    console.log('Adoptions response status:', res.status, res.statusText);
    const contentType = res.headers.get('content-type');
    console.log('Response content-type:', contentType);
    
    if (!res.ok) {
      let errorMsg = `Failed to fetch adoptions (${res.status} ${res.statusText})`;
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
          console.error('Error response (JSON):', errorData);
        } else {
          const errorText = await res.text();
          errorMsg = errorText || errorMsg;
          console.error('Error response (text):', errorText);
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMsg);
    }
    
    // Parse successful response
    let data;
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.warn('Response is not JSON, attempting to parse:', text.substring(0, 200));
        data = JSON.parse(text);
      }
      console.log('Adoptions data received:', data);
      console.log('Data type:', typeof data);
      console.log('Is array?', Array.isArray(data));
      if (!Array.isArray(data) && data !== null) {
        console.warn('Response is not an array:', data);
      }
    } catch (e) {
      console.error('Failed to parse response:', e);
      throw new Error('Invalid response format from server: ' + e.message);
    }
    
    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error - Backend might be down');
      throw new Error('Failed to connect to server. Please ensure the backend is running on http://localhost:8080');
    }
    // Re-throw other errors
    throw error;
  }
}

export async function updateAdoptionStatus(id, status) {
  const token = getToken();
  const url = new URL(`${API_BASE}/api/adoptions/${id}`);
  url.searchParams.set('status', status);
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url.toString(), {
    method: 'PATCH',
    headers
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to update status');
  return res.json();
}

export async function bookAppointment(atIso, durationMinutes) {
  const token = getToken();
  const url = new URL(`${API_BASE}/api/vet/appointments`);
  url.searchParams.set('at', atIso);
  if (durationMinutes) url.searchParams.set('duration', String(durationMinutes));
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to book appointment');
  }
  return res.json();
}

// Blog APIs
export async function fetchBlogs() {
  const res = await fetch(`${API_BASE}/api/blogs`);
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
}

export async function fetchBlog(id) {
  const res = await fetch(`${API_BASE}/api/blogs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch blog');
  return res.json();
}

export async function createBlog(post) {
  const token = getToken();
  const headers = {
      'Content-Type': 'application/json'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/blogs`, {
    method: 'POST',
    headers,
    body: JSON.stringify(post)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to create blog');
  }
  return res.json();
}

export async function updateBlog(id, post) {
  const token = getToken();
  const headers = {
      'Content-Type': 'application/json'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/blogs/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(post)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to update blog');
  }
  return res.json();
}

export async function deleteBlog(id) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/blogs/${id}`, {
    method: 'DELETE',
    headers
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to delete blog');
  }
  return true;
}

export async function uploadImage(file) {
  // Client-side validation
  if (!file) {
    throw new Error('Please select a file to upload');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
  }

  // Validate file size (10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error(`File size exceeds 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
  }

  const token = getToken();
  if (!token) {
    throw new Error('You must be logged in to upload images');
  }

  const form = new FormData();
  form.append('file', file);
  
  const headers = {};
  headers['Authorization'] = `Bearer ${token}`;
  // Don't set Content-Type - browser will set it with boundary for multipart/form-data

  const res = await fetch(`${API_BASE}/api/uploads/image`, {
    method: 'POST',
    headers,
    body: form
  });

  if (!res.ok) {
    let errorMsg = 'Failed to upload image';
    try {
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          errorMsg = json.error || json.message || text;
        } catch {
          errorMsg = text;
        }
      }
    } catch (e) {
      errorMsg = `Upload failed with status ${res.status}`;
    }
    throw new Error(errorMsg);
  }

  const data = await res.json();
  return data;
}

export async function seedPets() {
  try {
    await fetch(`${API_BASE}/api/dev/seed`, { method: 'POST' });
  } catch {}
}
