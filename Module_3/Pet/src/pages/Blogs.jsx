import { useState } from "react";

const SAMPLE_POSTS = [
  {
    id: 1,
    title: "Preparing Your Home for a New Pet",
    excerpt: "Simple steps to make your house pet-friendly before adoption.",
    img: "https://placekitten.com/600/350",
    author: "Anna",
    date: "Sep 01, 2025",
  },
  {
    id: 2,
    title: "Top 5 Puppy Training Tips",
    excerpt: "Basic training tips every new puppy owner should know.",
    img: "https://place-puppy.com/600x350",
    author: "Rahul",
    date: "Aug 22, 2025",
  },
  {
    id: 3,
    title: "How to Help Shy Cats",
    excerpt: "Techniques to help shy cats come out of their shell.",
    img: "https://placekitten.com/601/350",
    author: "Maya",
    date: "Jul 14, 2025",
  },
];

export default function Blogs() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    img: "",
    author: "",
  });

  const handleAddPost = (e) => {
    e.preventDefault();
    const newEntry = {
      ...newPost,
      id: posts.length + 1,
      date: new Date().toLocaleDateString(),
    };
    setPosts([newEntry, ...posts]);
    setNewPost({ title: "", excerpt: "", img: "", author: "" });
    setShowForm(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-700">Latest Blogs ✍️</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
        >
          + Add New Blog
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        Stories, tips, and guides about pet adoption and care.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
            onClick={() => setSelected(post)}
          >
            <img
              src={post.img || "https://placehold.co/600x350?text=No+Image"}
              alt={post.title}
              className="w-full h-44 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2">{post.excerpt}</p>
              <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                <span>By {post.author || "Anonymous"}</span>
                <span>{post.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Read Blog Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 md:w-3/4 p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <img
              src={selected.img}
              alt={selected.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold text-blue-700">
              {selected.title}
            </h3>
            <p className="text-gray-600 mt-3">
              {selected.excerpt} — (This is a demo article. Full content would
              be here.)
            </p>
            <div className="mt-4 text-sm text-gray-500">
              By {selected.author} • {selected.date}
            </div>
          </div>
        </div>
      )}

      {/* Add Blog Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddPost}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative"
          >
            <button
              onClick={() => setShowForm(false)}
              type="button"
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-blue-700 mb-4">
              Add New Blog Post
            </h3>

            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <textarea
              placeholder="Short Excerpt"
              value={newPost.excerpt}
              onChange={(e) =>
                setNewPost({ ...newPost, excerpt: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
              rows="3"
              required
            />

            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newPost.img}
              onChange={(e) =>
                setNewPost({ ...newPost, img: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Author name"
              value={newPost.author}
              onChange={(e) =>
                setNewPost({ ...newPost, author: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded"
            >
              Publish Blog
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
