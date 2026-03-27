import { useState, useContext } from "react";
import { loginUser } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">
          Welcome Back
        </h2>
        <p className="text-center text-slate-500 mb-6 text-sm">
          Login to manage your tasks efficiently
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="flex items-center border border-slate-200 rounded-lg px-3 mb-4 bg-slate-50">
          <Mail size={18} className="text-slate-400" />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 bg-transparent outline-none"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="flex items-center border border-slate-200 rounded-lg px-3 mb-4 bg-slate-50">
          <Lock size={18} className="text-slate-400" />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 bg-transparent outline-none"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-sm mt-5 text-center text-slate-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
