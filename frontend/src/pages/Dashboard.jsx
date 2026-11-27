
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function Dashboard() {
  const [students, setStudents] = useState(0);
  const [courses, setCourses] = useState(0);
  const [trainers, setTrainers] = useState(0);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentResponse, courseResponse, trainerResponse] =
          await Promise.all([
            axiosInstance.get("/students/api/students/"),
            axiosInstance.get("/students/api/courses/"),
            axiosInstance.get("/students/api/trainers/"),
          ]);

        setStudents(getCount(studentResponse.data));
        setCourses(getCount(courseResponse.data));
        setTrainers(getCount(trainerResponse.data));
      } catch (error) {
        console.error("Dashboard data error:", error);
        alert("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome to College Portal</h1>

      <p>Manage students and college information from one place.</p>

      {loading ? (
        <h3>Loading Dashboard...</h3>
      ) : (
        <div className="dashboard-cards">

          {/* Students Card */}
          <Link to="/students" className="dashboard-card">
            <h2>Students</h2>
            <h1>{students}</h1>
            <p>Total Students</p>
            <span>Click to view →</span>
          </Link>

          {/* Courses Card */}
          <Link to="/courses" className="dashboard-card">
            <h2>Courses</h2>
            <h1>{courses}</h1>
            <p>Total Courses</p>
            <span>Click to view →</span>
          </Link>

          {/* Trainers Card */}
          <Link to="/trainers" className="dashboard-card">
            <h2>Trainers</h2>
            <h1>{trainers}</h1>
            <p>Total Trainers</p>
            <span>Click to view →</span>
          </Link>

          {/* Admin Card */}
          <Link to="/admin" className="dashboard-card">
            <h2>Admin</h2>
            <p>Manage portal settings</p>
            <span>Click to explore →</span>
          </Link>

        </div>
      )}
    </div>
  );
}

export default Dashboard;
