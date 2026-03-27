import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RoleRoute({ children, role }) {
  const { user } = useContext(AuthContext);
  return user?.role === role ? children : <Navigate to="/unauthorized" replace />;
}