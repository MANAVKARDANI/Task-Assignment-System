import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../../layout/MainLayout";
import { getMyProfile, updateMyProfile } from "../../api/profileApi";
import { changePassword } from "../../api/authApi";

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

  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });

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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pw.currentPassword || !pw.newPassword) {
      toast.error("Please enter current and new password");
      return;
    }
    try {
      await changePassword(pw);
      toast.success("Password updated");
      setPw({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to update password");
    }
  };

  return (
    <MainLayout>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and update your profile
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
        >
          {editing ? "Close" : "Edit"}
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          Loading profile…
        </div>
      ) : !profile ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          No profile found
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4">
                {profile.image ? (
                  <img
                    alt="profile"
                    src={`http://localhost:5000/uploads/${profile.image}`}
                    className="h-14 w-14 rounded-full border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full border border-gray-200 bg-gray-100" />
                )}
                <div>
                  <p className="text-sm text-gray-500">Full name</p>
                  <p className="font-semibold text-gray-900">
                    {profile.full_name || profile.user?.name || "-"}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Post:</span>{" "}
                    {profile.post || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  First Name
                </label>
                <input
                  disabled={!editing}
                  className="input-saas mt-1.5 disabled:cursor-not-allowed disabled:bg-gray-50"
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <input
                  disabled={!editing}
                  className="input-saas mt-1.5 disabled:cursor-not-allowed disabled:bg-gray-50"
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  disabled={!editing}
                  className="input-saas mt-1.5 disabled:cursor-not-allowed disabled:bg-gray-50"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input
                  disabled={!editing}
                  className="input-saas mt-1.5 disabled:cursor-not-allowed disabled:bg-gray-50"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Mobile</label>
                <input
                  disabled={!editing}
                  className="input-saas mt-1.5 disabled:cursor-not-allowed disabled:bg-gray-50"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <input
                  disabled={!editing}
                  className="input-saas mt-1.5 disabled:cursor-not-allowed disabled:bg-gray-50"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Profile Image
              </label>
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
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    refresh();
                  }}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="mb-3 font-semibold text-gray-900">Change password</h2>
            <form
              onSubmit={handleChangePassword}
              className="grid gap-3 md:grid-cols-2"
            >
              <input
                type="password"
                placeholder="Current password"
                className="input-saas"
                value={pw.currentPassword}
                onChange={(e) =>
                  setPw((p) => ({ ...p, currentPassword: e.target.value }))
                }
              />
              <input
                type="password"
                placeholder="New password"
                className="input-saas"
                value={pw.newPassword}
                onChange={(e) =>
                  setPw((p) => ({ ...p, newPassword: e.target.value }))
                }
              />
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
                >
                  Update password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

