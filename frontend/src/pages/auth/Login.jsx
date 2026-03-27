import { useState, useContext } from "react";
import { loginUser } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const res = await loginUser(form);
      login(res.data);
      toast.success("Login successful");

      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/user");
    } catch (err) {
      setError(err?.response?.data?.msg || "Invalid email or password");
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
          <p className="mt-1 text-sm text-gray-500">Sign in to your workspace</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
          <h2 className="text-center text-lg font-semibold text-gray-900">
            Sign in
          </h2>
          <p className="mt-1 text-center text-sm text-gray-500">
            Use your work email and password
          </p>

          {error && (
            <div
              className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
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
                  autoComplete="current-password"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-gray-900 underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
