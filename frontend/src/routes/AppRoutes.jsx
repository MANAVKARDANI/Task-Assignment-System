import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AssignTask from "../pages/admin/AssignTask";
import ManageUsers from "../pages/admin/ManageUsers";

import UserDashboard from "../pages/user/UserDashboard";

import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/assign"
          element={
            <PrivateRoute>
              <RoleRoute role="admin">
                <AssignTask />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <RoleRoute role="admin">
                <ManageUsers />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <RoleRoute role="user">
                <UserDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
