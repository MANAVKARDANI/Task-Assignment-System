import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff, ChevronDown, Shield } from "lucide-react";
import MainLayout from "../../layout/MainLayout";
import { createUserByAdmin } from "../../api/userApi";
import { getPosts } from "../../api/postApi";

export default function AddUser() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    post_id: "",
  });

  useEffect(() => {
    getPosts()
      .then((res) => setPosts(res.data))
      .catch(() => toast.error("Failed to load posts"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error("Please fill in name, email, and password");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role || "user",
    };
    if (form.post_id) payload.post_id = Number(form.post_id);

    setLoading(true);
    try {
      await createUserByAdmin(payload);
      toast.success("User created successfully");
      try {
        window.dispatchEvent(new CustomEvent("users:changed"));
      } catch {
        // ignore
      }
      navigate("/admin/users");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <Link
            to="/admin/users"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to users
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">
            Add user
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a workspace account (same steps as registration, admin-controlled)
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          <h2 className="text-center text-lg font-semibold text-gray-900">
            New team member
          </h2>
          <p className="mt-1 text-center text-sm text-gray-500">
            What details should we use for this account?
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                What is their full name?
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 transition focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100">
                <User size={16} className="shrink-0 text-gray-400" />
                <input
                  placeholder="Jane Doe"
                  className="input-saas border-0 bg-transparent px-0 py-2.5 shadow-none focus:ring-0"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                What email will they sign in with?
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 transition focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100">
                <Mail size={16} className="shrink-0 text-gray-400" />
                <input
                  type="email"
                  autoComplete="off"
                  placeholder="you@company.com"
                  className="input-saas border-0 bg-transparent px-0 py-2.5 shadow-none focus:ring-0"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                What temporary password should we set?
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 transition focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100">
                <Lock size={16} className="shrink-0 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="input-saas min-w-0 flex-1 border-0 bg-transparent px-0 py-2.5 shadow-none focus:ring-0"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                What role should they have? (optional, default member)
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 transition focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100">
                <Shield size={16} className="shrink-0 text-gray-400" />
                <select
                  className="input-saas w-full cursor-pointer border-0 bg-transparent px-0 py-2.5 shadow-none focus:ring-0"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="user">Member (user)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Which post or title applies? (optional)
              </label>
              <div className="relative">
                <select
                  className="input-saas w-full cursor-pointer appearance-none pr-10"
                  value={form.post_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      post_id: e.target.value ? Number(e.target.value) : "",
                    })
                  }
                >
                  <option value="">No post</option>
                  {posts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create user"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
