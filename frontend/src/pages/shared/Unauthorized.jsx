import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="card p-10 text-center max-w-lg w-full">
        <p className="text-sm font-semibold text-amber-600">403</p>
        <h1 className="text-3xl font-bold mt-2 text-slate-900">Unauthorized</h1>
        <p className="text-slate-500 mt-3">
          You do not have permission to access this route.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-900"
        >
          Go to login
        </Link>
      </div>
    </div>
  );
}
