import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../../layout/MainLayout";
import { getMyProfile, updateMyProfile } from "../../api/profileApi";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    full_name: "",
    mobile: "",
    address: "",
    email: "",
    image: null,
  });

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getMyProfile();
      setProfile(res.data);
      setForm({
        first_name: res.data?.first_name || "",
        last_name: res.data?.last_name || "",
        full_name: res.data?.full_name || "",
        mobile: res.data?.mobile || "",
        address: res.data?.address || "",
        email: res.data?.email || res.data?.user_email || "",
        image: null,
      });
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("full_name", form.full_name || "");
    fd.append("first_name", form.first_name || "");
    fd.append("last_name", form.last_name || "");
    fd.append("mobile", form.mobile || "");
    fd.append("address", form.address || "");
    fd.append("email", form.email || "");
    if (form.image) fd.append("image", form.image);

    try {
      await updateMyProfile(fd);
      toast.success("Profile updated");
      setEditing(false);
      await refresh();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to update profile");
    }
  };

  return (
    <MainLayout>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-500 text-sm mt-1">View and update your profile</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          {editing ? "Close" : "Edit"}
        </button>
      </div>

      {loading ? (
        <div className="card p-6 text-slate-500">Loading profile...</div>
      ) : !profile ? (
        <div className="card p-6 text-slate-500">No profile found</div>
      ) : (
        <div className="card p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4">
                {profile.image ? (
                  <img
                    alt="profile"
                    src={`http://localhost:5000/uploads/${profile.image}`}
                    className="h-14 w-14 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-slate-100 border border-slate-200" />
                )}
                <div>
                  <p className="text-sm text-slate-500">Full name</p>
                  <p className="font-semibold text-slate-900">
                    {profile.full_name || profile.user?.name || "-"}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    <span className="font-medium">Post:</span> {profile.post || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  First Name
                </label>
                <input
                  disabled={!editing}
                  className="w-full p-2 border border-slate-200 rounded-lg mt-1 bg-white"
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Last Name
                </label>
                <input
                  disabled={!editing}
                  className="w-full p-2 border border-slate-200 rounded-lg mt-1 bg-white"
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">Full Name</label>
                <input
                  disabled={!editing}
                  className="w-full p-2 border border-slate-200 rounded-lg mt-1 bg-white"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">Email</label>
                <input
                  disabled={!editing}
                  className="w-full p-2 border border-slate-200 rounded-lg mt-1 bg-white"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">Mobile</label>
                <input
                  disabled={!editing}
                  className="w-full p-2 border border-slate-200 rounded-lg mt-1 bg-white"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">Address</label>
                <input
                  disabled={!editing}
                  className="w-full p-2 border border-slate-200 rounded-lg mt-1 bg-white"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-600 font-medium">Profile Image</label>
              <div className="mt-2 flex items-center gap-4">
                {editing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.files?.[0] || null })
                    }
                  />
                )}
              </div>
            </div>

            {editing && (
              <div className="flex gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    refresh();
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </MainLayout>
  );
}

