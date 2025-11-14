import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBlog, fetchBlog, updateBlog, uploadImage, getUser } from "../api";

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user && user.name) {
      setAuthorName(user.name);
    }
    if (id) {
      fetchBlog(id).then(b => {
        setTitle(b.title || ""); 
        setContent(b.content || ""); 
        setAuthorName(b.authorName || user?.name || ""); 
        setCategory(b.category || ""); 
        setImageUrl(b.imageUrl || "");
      }).catch(() => {});
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { title, content, authorName, category, imageUrl };
      if (id) await updateBlog(id, payload);
      else await createBlog(payload);
      navigate('/blogs');
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">{id ? 'Edit' : 'New'} Blog Post</h2>
      <form onSubmit={submit} className="space-y-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required className="w-full p-3 border rounded" />
        <input value={authorName} onChange={e=>setAuthorName(e.target.value)} placeholder="Author" required className="w-full p-3 border rounded" />
        <div className="flex items-center gap-3 flex-wrap">
          <input 
            type="file" 
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={e=>setFile(e.target.files?.[0]||null)} 
            disabled={uploading}
            className="border p-2 rounded"
          />
          <button 
            type="button" 
            className="px-3 py-2 bg-blue-50 border rounded disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={!file || uploading}
            onClick={async()=>{ 
              if (!file) return; 
              setUploading(true);
              try { 
                const { url } = await uploadImage(file); 
                setImageUrl(url); 
                setFile(null); // Clear file input
              } catch(e){ 
                alert('Upload failed: ' + e.message); 
              } finally {
                setUploading(false);
              }
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          {imageUrl && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-600">✓ Uploaded</span>
              <img src={imageUrl} alt="Preview" className="h-12 w-12 object-cover rounded border" />
            </div>
          )}
          {file && !uploading && (
            <span className="text-xs text-gray-500">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          )}
        </div>
        <textarea value={content} onChange={e=>setContent(e.target.value)} rows={12} placeholder="Content" required className="w-full p-3 border rounded" />
        <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full p-3 border rounded">
          <option value="">Select category</option>
          <option value="Care Tips">Care Tips</option>
          <option value="Training">Training</option>
          <option value="Health">Health</option>
        </select>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-500 text-white rounded">Save</button>
          <button type="button" onClick={() => navigate('/blogs')} className="px-4 py-2 bg-blue-50 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
