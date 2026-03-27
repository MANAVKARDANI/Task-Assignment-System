import { useEffect, useState } from "react";
import { registerUser } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <form
        className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h2>

        <p className="text-center text-slate-500 mb-6 text-sm">
          Start managing tasks like a pro
        </p>

        {/* Name */}
        <div className="flex items-center border border-slate-200 rounded-lg px-3 mb-3 bg-slate-50">
          <User size={18} className="text-slate-400" />
          <input
            placeholder="Full Name"
            className="w-full p-2 bg-transparent outline-none"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="flex items-center border border-slate-200 rounded-lg px-3 mb-3 bg-slate-50">
          <Mail size={18} className="text-slate-400" />
          <input
            placeholder="Email"
            className="w-full p-2 bg-transparent outline-none"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="flex items-center border border-slate-200 rounded-lg px-3 mb-3 bg-slate-50">
          <Lock size={18} className="text-slate-400" />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 bg-transparent outline-none"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Post */}
        <select
          className="w-full p-2 border border-slate-200 rounded mb-4"
          value={form.post_id}
          onChange={(e) => setForm({ ...form, post_id: Number(e.target.value) })}
        >
          <option value="">Select Post</option>
          {posts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-60">
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-sm mt-4 text-center">
          Already have account?{" "}
          <Link to="/" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
