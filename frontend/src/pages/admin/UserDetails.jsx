import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import { getUserDetails } from "../../api/userApi";
import TaskTable from "../../components/task/TaskTable";

export default function UserDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDetails(id)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <MainLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">User Details</h1>
        <p className="text-slate-500 text-sm mt-1">Profile and assigned tasks</p>
      </div>

      {loading ? (
        <div className="card p-6 text-slate-500">Loading user...</div>
      ) : !data ? (
        <div className="card p-6 text-slate-500">User not found</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="card p-5">
              <h2 className="font-semibold text-slate-800 mb-3">Profile</h2>
              <div className="flex items-center gap-4 mb-4">
                {data.profile?.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${data.profile.image}`}
                    alt="profile"
                    className="h-14 w-14 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-slate-100 border border-slate-200" />
                )}
                <div>
                  <p className="text-sm text-slate-500">Full name</p>
                  <p className="font-semibold text-slate-900">{data.profile?.full_name || data.user?.name || "-"}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Name:</span>{" "}
                {data.user?.name || "-"}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Email:</span>{" "}
                {data.user?.email || "-"}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Mobile:</span>{" "}
                {data.user?.mobile || "-"}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Post:</span>{" "}
                {data.user?.post || "-"}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Status:</span>{" "}
                {data.user?.status || "-"}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                <span className="font-medium text-slate-800">Address:</span>{" "}
                {data.profile?.address || "-"}
              </p>
            </div>

            <div className="card p-5">
              <h2 className="font-semibold text-slate-800 mb-3">Assigned Tasks</h2>
              <p className="text-sm text-slate-600">
                Total tasks: <span className="font-medium">{data.tasks?.length || 0}</span>
              </p>
            </div>
          </div>

          <TaskTable tasks={data.tasks || []} />
        </>
      )}
    </MainLayout>
  );
}

