import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../../layout/MainLayout";
import { createPost, deletePost, getPosts } from "../../api/postApi";

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getPosts();
      setPosts(res.data);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Post name is required");
      return;
    }
    try {
      await createPost(name.trim());
      setName("");
      toast.success("Post added");
      await refresh();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to create post");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      toast.success("Post deleted");
      await refresh();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to delete post");
    }
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Manage Posts</h1>
        <p className="text-slate-500 text-sm mt-1">Add or remove job posts</p>
      </div>

      <form onSubmit={handleAdd} className="card p-5 mb-6 max-w-2xl">
        <div className="flex gap-3">
          <input
            className="w-full p-2 border border-slate-200 rounded-lg"
            placeholder="Post name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
            Add
          </button>
        </div>
      </form>

      {loading ? (
        <div className="card p-6 text-slate-500">Loading posts...</div>
      ) : (
        <div className="card p-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-2">Post</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="py-3 font-medium text-slate-800">{p.name}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td className="py-6 text-slate-500" colSpan={2}>
                    No posts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
}

