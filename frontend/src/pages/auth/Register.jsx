import { useEffect, useState } from "react";
import { registerUser } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { getPosts } from "../../api/postApi";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    post_id: "",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getPosts()
      .then((res) => setPosts(res.data))
      .catch(() => toast.error("Failed to load posts"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.post_id) delete payload.post_id;
      await registerUser(payload);
      toast.success("Account created successfully");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            Task System
          </h1>
          <p className="mt-1 text-sm text-gray-500">Create your account</p>
        </div>

        <form
          className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center text-lg font-semibold text-gray-900">
            Register
          </h2>
          <p className="mt-1 text-center text-sm text-gray-500">
            Join your team workspace
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Full name
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 transition focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100">
                <User size={16} className="shrink-0 text-gray-400" />
                <input
                  placeholder="Jane Doe"
                  className="input-saas border-0 bg-transparent px-0 py-2.5 shadow-none focus:ring-0"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 transition focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100">
                <Mail size={16} className="shrink-0 text-gray-400" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="input-saas border-0 bg-transparent px-0 py-2.5 shadow-none focus:ring-0"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 transition focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100">
                <Lock size={16} className="shrink-0 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="input-saas min-w-0 flex-1 border-0 bg-transparent px-0 py-2.5 shadow-none focus:ring-0"
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
                Post / role
              </label>
              <div className="relative">
                <select
                  className="input-saas w-full cursor-pointer appearance-none pr-10"
                  value={form.post_id}
                  onChange={(e) =>
                    setForm({ ...form, post_id: Number(e.target.value) })
                  }
                >
                  <option value="">Select post</option>
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
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-medium text-gray-900 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
