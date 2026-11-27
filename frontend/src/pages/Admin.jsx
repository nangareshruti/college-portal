
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Admin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    trainers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCount = (data) => {
    if (Array.isArray(data)) {
      return data.length;
    }

    if (data && Array.isArray(data.results)) {
      return data.results.length;
    }

    if (data && typeof data.count === "number") {
      return data.count;
    }

    return 0;
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsResponse, coursesResponse, trainersResponse] =
        await Promise.all([
          axiosInstance.get("/students/api/students/"),
          axiosInstance.get("/students/api/courses/"),
          axiosInstance.get("/students/api/trainers/"),
        ]);

      setStats({
        students: getCount(studentsResponse.data),
        courses: getCount(coursesResponse.data),
        trainers: getCount(trainersResponse.data),
      });
    } catch (error) {
      console.error("Error fetching admin statistics:", error);
      setError("Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statStyle = {
    fontSize: "55px",
    fontWeight: "bold",
    color: "#2563eb",
    margin: "20px 0",
    lineHeight: "1.2",
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <p className="admin-subtitle">
        Manage your College Portal and monitor system information.
      </p>

      {/* Statistics */}
      <div className="admin-grid">

        {/* Students */}
        <div className="admin-card">
          <h2>👨‍🎓 Total Students</h2>

          <h1 style={statStyle}>
            {loading ? "..." : stats.students}
          </h1>

          <p>Registered students in the portal</p>

          <button onClick={() => navigate("/students")}>
            Manage Students
          </button>
        </div>

        {/* Courses */}
        <div className="admin-card">
          <h2>📚 Total Courses</h2>

          <h1 style={statStyle}>
            {loading ? "..." : stats.courses}
          </h1>

          <p>Available courses in the portal</p>

          <button onClick={() => navigate("/courses")}>
            Manage Courses
          </button>
        </div>

        {/* Trainers */}
        <div className="admin-card">
          <h2>👩‍🏫 Total Trainers</h2>

          <h1 style={statStyle}>
            {loading ? "..." : stats.trainers}
          </h1>

          <p>Registered trainers in the portal</p>

          <button onClick={() => navigate("/trainers")}>
            Manage Trainers
          </button>
        </div>
      </div>

      {/* Management */}
      <h2 style={{ marginTop: "35px" }}>Management</h2>

      <div className="admin-grid">

        <div
          className="admin-card"
          onClick={() => navigate("/students")}
          style={{ cursor: "pointer" }}
        >
          <h2>Student Management</h2>
          <p>Add, view, edit, search and delete student records.</p>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/courses")}
          style={{ cursor: "pointer" }}
        >
          <h2>Course Management</h2>
          <p>Manage courses and assign trainers.</p>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/trainers")}
          style={{ cursor: "pointer" }}
        >
          <h2>Trainer Management</h2>
          <p>Add, view and manage trainer information.</p>
        </div>

      </div>

      {/* Portal Overview */}
      <div className="admin-card" style={{ marginTop: "25px" }}>
        <h2>Portal Overview</h2>

        <p>
          The College Portal provides centralized management of
          students, courses and trainers using React, Django REST
          Framework and JWT authentication.
        </p>

        <button onClick={fetchStats}>
          🔄 Refresh Dashboard
        </button>
      </div>

      {/* Error */}
      {error && (
        <p style={{ color: "red", marginTop: "20px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Admin;
