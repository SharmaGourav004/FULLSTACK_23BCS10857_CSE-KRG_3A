import { useEffect, useState } from "react";
import { createPet, deletePet, fetchPets, getRole, updatePet, uploadImage } from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminPets() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', species: '', breed: '', age: '', gender: '', description: '', imageUrl: '', location: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = getRole();
    if (!role || role !== 'ADMIN') { 
      navigate('/'); 
      return; 
    }
    refresh();
  }, [navigate]);

  async function refresh() {
    try { setPets(await fetchPets()); } catch {}
  }

  async function handleUpload() {
    if (!file) {
      alert('Please select an image file first');
      return;
    }
    setUploading(true);
    try { 
      const { url } = await uploadImage(file); 
      setForm({ ...form, imageUrl: url }); 
      setFile(null); // Clear file input
      alert('Image uploaded successfully!');
    } catch (e) { 
      alert('Upload failed: ' + e.message); 
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    try {
      const payload = { ...form, age: form.age ? Number(form.age) : null };
      if (form.id) await updatePet(form.id, payload); else await createPet(payload);
      setForm({ id: null, name: '', species: '', breed: '', age: '', gender: '', description: '', imageUrl: '', location: '' });
      setFile(null);
      await refresh();
    } catch (e) { alert(e.message); }
  }

  async function remove(id) {
    if (!confirm('Delete this pet?')) return;
    try { await deletePet(id); await refresh(); } catch (e) { alert(e.message); }
  }

  function edit(p) {
    setForm({ id: p.id, name: p.name, species: p.species, breed: p.breed, age: p.age||'', gender: p.gender||'', description: p.description||'', imageUrl: p.imageUrl||'', location: p.location||'' });
    setFile(null); // Clear any selected file when editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Admin — Pets</h2>

      <div className="bg-white p-4 rounded shadow mb-8">
        <div className="grid grid-cols-2 gap-3">
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="border p-2 rounded" />
          <input value={form.species} onChange={e=>setForm({...form, species:e.target.value})} placeholder="Species" className="border p-2 rounded" />
          <input value={form.breed} onChange={e=>setForm({...form, breed:e.target.value})} placeholder="Breed" className="border p-2 rounded" />
          <input value={form.age} onChange={e=>setForm({...form, age:e.target.value})} placeholder="Age" className="border p-2 rounded" />
          <select value={form.gender} onChange={e=>setForm({...form, gender:e.target.value})} className="border p-2 rounded">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknown">Unknown</option>
          </select>
          <input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} placeholder="Location" className="border p-2 rounded" />
          <input value={form.imageUrl} onChange={e=>setForm({...form, imageUrl:e.target.value})} placeholder="Image URL" className="border p-2 rounded col-span-2" />
        </div>
        <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" className="border p-2 rounded w-full mt-3" />
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <input 
            type="file" 
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={e=>setFile(e.target.files?.[0]||null)} 
            disabled={uploading}
            className="border p-2 rounded"
          />
          <button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            className="px-3 py-2 bg-blue-50 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
          </button>
          {file && !uploading && (
            <span className="text-xs text-gray-500">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          )}
          {form.imageUrl && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-600">✓ Image ready</span>
              <img src={form.imageUrl} alt="Preview" className="h-10 w-10 object-cover rounded border" />
            </div>
          )}
          <button onClick={save} className="px-4 py-2 bg-emerald-500 text-white rounded">{form.id ? 'Update' : 'Create'} Pet</button>
          {form.id && <button onClick={()=>{setForm({ id: null, name: '', species: '', breed: '', age: '', gender: '', description: '', imageUrl: '', location: '' }); setFile(null);}} className="px-3 py-2 bg-blue-50 border rounded">Clear</button>}
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-blue-50">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Species</th>
              <th className="p-3">Breed</th>
              <th className="p-3">Age</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3"><img src={p.imageUrl||'https://placehold.co/80'} alt="" className="w-16 h-16 object-cover rounded"/></td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.species}</td>
                <td className="p-3">{p.breed}</td>
                <td className="p-3">{p.age}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={()=>edit(p)} className="px-3 py-1 bg-blue-50 border rounded">Edit</button>
                  <button onClick={()=>remove(p.id)} className="px-3 py-1 bg-red-50 border rounded">Delete</button>
                </td>
              </tr>
            ))}
            {pets.length === 0 && (
              <tr><td className="p-4 text-gray-500" colSpan={6}>No pets. Create one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


