import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Admin from "./pages/Admin";
import Trainers from "./pages/Trainers";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    alert("Logged out successfully!");

    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Login</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/students">Students</Link> |{" "}
        <Link to="/courses">Courses</Link> |{" "}
        <Link to="/trainers">Trainers</Link> |{" "}
        <Link to="/admin">Admin</Link> |{" "}
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Students */}
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />

        {/* Courses */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />

        {/* Trainers */}
        <Route
          path="/trainers"
          element={
            <ProtectedRoute>
              <Trainers />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;