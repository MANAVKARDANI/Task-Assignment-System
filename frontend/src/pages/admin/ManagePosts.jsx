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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Manage posts
        </h1>
        <p className="mt-1 text-sm text-gray-500">Add or remove job posts</p>
      </div>

      <form
        onSubmit={handleAdd}
        className="mb-6 max-w-2xl rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-wrap gap-3">
          <input
            className="input-saas min-w-[200px] flex-1"
            placeholder="Post name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
          >
            Add
          </button>
        </div>
      </form>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          Loading posts…
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/90 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Post</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {p.name}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="text-sm font-medium text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-500" colSpan={2}>
                      No posts yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
