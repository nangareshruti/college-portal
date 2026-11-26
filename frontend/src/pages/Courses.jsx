
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [courseName, setCourseName] = useState("");
  const [duration, setDuration] = useState("");
  const [trainer, setTrainer] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const COURSE_API = "/students/api/courses/";
  const TRAINER_API = "/students/api/trainers/";

  // Fetch courses and trainers
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [courseResponse, trainerResponse] = await Promise.all([
        axiosInstance.get(COURSE_API),
        axiosInstance.get(TRAINER_API),
      ]);

      setCourses(courseResponse.data);
      setTrainers(trainerResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Unable to load courses or trainers.");
    } finally {
      setLoading(false);
    }
  };

  // Load data when page opens
  useEffect(() => {
    fetchData();
  }, []);

  // Validate course form
  const validateCourse = () => {
    const trimmedName = courseName.trim();
    const trimmedDuration = duration.trim();

    // Course name: only letters and spaces
    if (!/^[A-Za-z ]+$/.test(trimmedName)) {
      alert("Course name can contain only letters and spaces.");
      return false;
    }

    // Duration: letters, numbers and spaces
    if (!/^[A-Za-z0-9 ]+$/.test(trimmedDuration)) {
      alert("Course duration can contain only letters, numbers and spaces.");
      return false;
    }

    if (!trainer) {
      alert("Please select a trainer.");
      return false;
    }

    return true;
  };

  // Add course
  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (!validateCourse()) {
      return;
    }

    const courseData = {
      name: courseName.trim(),
      duration: duration.trim(),
      trainer: Number(trainer),
    };

    try {
      await axiosInstance.post(COURSE_API, courseData);

      alert("Course added successfully!");

      setCourseName("");
      setDuration("");
      setTrainer("");
      setShowForm(false);

      await fetchData();
    } catch (error) {
      console.error("Error adding course:", error);

      if (error.response?.data) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Failed to add course.");
      }
    }
  };

  // Delete course
  const handleDeleteCourse = async (course) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${course.name}?`
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`${COURSE_API}${course.id}/`);

      alert("Course deleted successfully!");

      await fetchData();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course.");
    }
  };

  // Get trainer name
  const getTrainerName = (trainerId) => {
    const selectedTrainer = trainers.find(
      (item) => item.id === trainerId
    );

    return selectedTrainer
      ? selectedTrainer.name
      : "Unknown Trainer";
  };

  return (
    <div className="courses-container">
      <h1>Course Management</h1>
      <p>Manage college courses</p>

      <div className="courses-header">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Course"}
        </button>
      </div>

      {/* Add Course Form */}
      {showForm && (
        <div className="course-form">
          <h2>Add New Course</h2>

          <form onSubmit={handleAddCourse}>
            <input
              type="text"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Course Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />

            <select
              value={trainer}
              onChange={(e) => setTrainer(e.target.value)}
              required
            >
              <option value="">Select Trainer</option>

              {trainers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <div className="form-buttons">
              <button type="submit">Save Course</button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading && <p>Loading courses...</p>}

      {/* Error */}
      {error && <p className="error-message">{error}</p>}

      {/* Course Table */}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Name</th>
              <th>Duration</th>
              <th>Trainer</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.duration}</td>
                <td>{getTrainerName(course.trainer)}</td>

                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteCourse(course)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {courses.length === 0 && (
              <tr>
                <td colSpan="5">No courses available.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Courses;
