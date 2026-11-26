import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [students, setStudents] = useState(0);
  const [courses, setCourses] = useState(0);
  const [trainers, setTrainers] = useState(0);
  const [loading, setLoading] = useState(true);

  const STUDENT_API = "http://127.0.0.1:8000/students/api/students/";
  const COURSE_API = "http://127.0.0.1:8000/students/api/courses/";
  const TRAINER_API = "http://127.0.0.1:8000/students/api/trainers/";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [studentResponse, courseResponse, trainerResponse] =
          await Promise.all([
            axios.get(STUDENT_API, { headers }),
            axios.get(COURSE_API, { headers }),
            axios.get(TRAINER_API, { headers }),
          ]);

        setStudents(studentResponse.data.length);
        setCourses(courseResponse.data.length);
        setTrainers(trainerResponse.data.length);
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
          <div
            className="dashboard-card"
            onClick={() => alert("Admin settings coming soon!")}
          >
            <h2>Admin</h2>
            <p>Manage portal settings</p>
            <span>Click to explore →</span>
          </div>

        </div>
      )}
    </div>
  );
}

export default Dashboard;