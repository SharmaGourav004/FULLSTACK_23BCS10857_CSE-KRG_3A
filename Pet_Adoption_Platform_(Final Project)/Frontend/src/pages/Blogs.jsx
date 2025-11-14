import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs, deleteBlog, getRole, getUser } from "../api";

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState('All');
  const role = getRole();
  const currentUser = getUser();

  const loadBlogs = () => {
    setLoading(true);
    fetchBlogs()
      .then((data) => {
        setPosts(data || []);
      })
      .catch((e) => {
        setError(e?.message || "Failed to load blogs");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }
    try {
      await deleteBlog(id);
      loadBlogs(); // Reload the blogs after deletion
    } catch (e) {
      alert(e?.message || "Failed to delete blog");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">Our Blog</h2>
        {currentUser.name && (
          <Link to="/blogs/new" className="px-4 py-2 bg-emerald-500 text-white rounded">
            Write a new blog!
          </Link>
        )}
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="mb-4">
        <select value={category} onChange={e=>setCategory(e.target.value)} className="border p-2 rounded">
          <option>All</option>
          <option>Care Tips</option>
          <option>Training</option>
          <option>Health</option>
        </select>
      </div>

      <div className="space-y-4">
        {(useMemo(()=>{
          if (category==='All') return posts;
          return posts.filter(p => (p.category||'')===category);
        }, [posts, category])).map((p) => {
          // Check if current user can delete this post
          const isOwner = currentUser.email && p.authorEmail && 
                         currentUser.email.toLowerCase() === p.authorEmail.toLowerCase();
          const canDelete = role === 'ADMIN' || isOwner;
          
          return (
            <article key={p.id} className="bg-white p-4 rounded shadow">
              {p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-56 object-contain rounded mb-3 bg-gray-100" />}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-700">
                    <Link to={`/blogs/${p.id}`}>{p.title}</Link>
                  </h3>
                  <div className="text-sm text-gray-500">By {p.authorName || p.author} {p.category?`· ${p.category}`:''} · {new Date(p.createdAt || Date.now()).toLocaleDateString()}</div>
                  <p className="mt-2 text-gray-700">{p.content ? p.content.slice(0, 180) : p.excerpt}{(p.content && p.content.length > 180) ? '...' : ''}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  {isOwner && (
                    <Link
                      to={`/blogs/${p.id}/edit`}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      title="Edit your post"
                    >
                      ✏️ Edit
                    </Link>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      title={isOwner ? "Delete your post" : "Delete this blog post (Admin)"}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
        {(!loading && posts.length === 0) && (
          <div className="text-gray-600">No blog posts yet.</div>
        )}
      </div>
    </div>
  );
}

