import { useState } from "react";
import { registerUser } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await registerUser(form);

    setLoading(false);
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700">
      <form
        className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center mb-2">
          Create Account 🚀
        </h2>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Start managing tasks like a pro
        </p>

        {/* Name */}
        <div className="flex items-center border rounded-lg px-3 mb-3 bg-gray-50">
          <User size={18} className="text-gray-400" />
          <input
            placeholder="Full Name"
            className="w-full p-2 bg-transparent outline-none"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="flex items-center border rounded-lg px-3 mb-3 bg-gray-50">
          <Mail size={18} className="text-gray-400" />
          <input
            placeholder="Email"
            className="w-full p-2 bg-transparent outline-none"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="flex items-center border rounded-lg px-3 mb-3 bg-gray-50">
          <Lock size={18} className="text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 bg-transparent outline-none"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Role */}
        <select
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">
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
