import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="card p-10 text-center max-w-lg w-full">
        <p className="text-sm font-semibold text-blue-600">404</p>
        <h1 className="text-3xl font-bold mt-2 text-slate-900">Page not found</h1>
        <p className="text-slate-500 mt-3">
          The page you are looking for does not exist or was moved.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
