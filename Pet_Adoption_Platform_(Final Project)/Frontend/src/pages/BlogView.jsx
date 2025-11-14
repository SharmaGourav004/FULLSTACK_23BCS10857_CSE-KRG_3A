import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchBlog, deleteBlog, getRole, getUser, API_BASE, getToken } from "../api";

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = getRole();
  const user = getUser();

  useEffect(() => {
    fetchBlog(id).then(setPost).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await deleteBlog(id);
      navigate('/blogs');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!post) return <div className="p-8">Not found</div>;

  const canEdit = role === 'ADMIN' || (user?.email && user.email === (post.authorEmail || post.author?.email));
  const canLike = !!getToken();
  const [liking, setLiking] = useState(false);
  async function like() {
    if (!canLike) return;
    setLiking(true);
    try {
      const token = getToken();
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      await fetch(`${API_BASE}/api/blogs/${id}/like`, { method: 'POST', headers });
      const fresh = await fetchBlog(id);
      setPost(fresh);
    } catch (err) {
      alert('Failed to like: ' + err.message);
    } finally { setLiking(false); }
  }
  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-3xl font-bold text-blue-700">{post.title}</h2>
      <div className="text-sm text-gray-500 mb-4">By {post.authorName || post.author} · {new Date(post.createdAt).toLocaleDateString()}</div>
      {post.imageUrl && <img src={post.imageUrl} alt="" className="w-full h-64 object-contain rounded mb-4 bg-gray-100" />}
      <div className="prose max-w-none text-gray-800">{post.content}</div>

      <div className="mt-6 flex gap-3">
        <Link to="/blogs" className="px-4 py-2 bg-blue-50 border rounded">Back</Link>
        <button disabled={!canLike||liking} onClick={like} className="px-4 py-2 bg-blue-600 text-white rounded">Like {typeof post.likes==='number'?`(${post.likes})`:''}</button>
        {canEdit && <Link to={`/blogs/${id}/edit`} className="px-4 py-2 bg-amber-400 text-white rounded">Edit</Link>}
        {canEdit && <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>}
      </div>
    </div>
  );
}
