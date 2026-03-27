import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AssignTask from "../pages/admin/AssignTask";
import ManageUsers from "../pages/admin/ManageUsers";
import AllTasks from "../pages/admin/AllTasks";
import UserDetails from "../pages/admin/UserDetails";
import ManagePosts from "../pages/admin/ManagePosts";

import UserDashboard from "../pages/user/UserDashboard";
import MyTasks from "../pages/user/MyTasks";
import TaskDetails from "../pages/user/TaskDetails";
import Profile from "../pages/user/Profile";
import Notifications from "../pages/user/Notifications";
import NotFound from "../pages/shared/NotFound";
import Unauthorized from "../pages/shared/Unauthorized";

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
          path="/admin/posts"
          element={
            <PrivateRoute>
              <RoleRoute role="admin">
                <ManagePosts />
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

        <Route
          path="/admin/users/:id"
          element={
            <PrivateRoute>
              <RoleRoute role="admin">
                <UserDetails />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/tasks"
          element={
            <PrivateRoute>
              <RoleRoute role="admin">
                <AllTasks />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/tasks/:id"
          element={
            <PrivateRoute>
              <RoleRoute role="admin">
                <TaskDetails />
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
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/tasks"
          element={
            <PrivateRoute>
              <RoleRoute role="user">
                <MyTasks />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/user/tasks/:id"
          element={
            <PrivateRoute>
              <RoleRoute role="user">
                <TaskDetails />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
