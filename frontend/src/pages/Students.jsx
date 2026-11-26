
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");

  const API_URL = "/students/api/students/";

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(API_URL);

      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Unable to load students. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  // Load students when page opens
  useEffect(() => {
    fetchStudents();
  }, []);

  // Search students
  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase()) ||
      student.course?.toLowerCase().includes(search.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCourse("");
    setAge("");
    setEditingId(null);
    setShowForm(false);
  };

  // Edit student
  const handleEdit = (student) => {
    setEditingId(student.id);
    setName(student.name || "");
    setEmail(student.email || "");
    setPhone(String(student.phone || ""));
    setCourse(student.course || "");
    setAge(String(student.age || ""));
    setShowForm(true);
  };

  // Delete student
  const handleDelete = async (student) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`${API_URL}${student.id}/`);

      alert("Student deleted successfully!");

      await fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student.");
    }
  };

  // Validate student details
  const validateStudent = () => {
    // Name: only letters and spaces
    if (!/^[A-Za-z ]+$/.test(name.trim())) {
      alert("Student name can contain only letters and spaces!");
      return false;
    }

    // Email: Gmail only
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim())) {
      alert("Please enter a valid Gmail address ending with @gmail.com!");
      return false;
    }

    // Phone: exactly 10 digits
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number must contain exactly 10 digits!");
      return false;
    }

    // Age: between 15 and 100
    const studentAge = Number(age);

    if (!age || studentAge < 15 || studentAge > 100) {
      alert("Age must be between 15 and 100!");
      return false;
    }

    // Course validation
    if (!course.trim()) {
      alert("Please enter the course!");
      return false;
    }

    return true;
  };

  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validations
    if (!validateStudent()) {
      return;
    }

    const studentData = {
      name: name.trim(),
      email: email.trim(),
      phone,
      course: course.trim(),
      age: Number(age),
    };

    try {
      if (editingId !== null) {
        await axiosInstance.patch(
          `${API_URL}${editingId}/`,
          studentData
        );

        alert("Student updated successfully!");
      } else {
        await axiosInstance.post(API_URL, studentData);

        alert("Student added successfully!");
      }

      resetForm();
      await fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);

      if (error.response?.data) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Failed to save student.");
      }
    }
  };

  return (
    <div className="students-container">
      <h1>Student Management</h1>
      <p>View and manage student records.</p>

      {/* Search and Add Student */}
      <div className="students-header">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Student
        </button>
      </div>

      {/* Student Form */}
      {showForm && (
        <div className="student-form">
          <h2>{editingId !== null ? "Edit Student" : "Add New Student"}</h2>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <input
              type="text"
              placeholder="Student Name"
              value={name}
              onChange={(e) => {
                const value = e.target.value;

                // Only letters and spaces allowed
                if (/^[A-Za-z ]*$/.test(value)) {
                  setName(value);
                }
              }}
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Student Gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Phone */}
            <input
              type="tel"
              placeholder="10-digit Phone Number"
              value={phone}
              onChange={(e) => {
                // Only numbers, maximum 10 digits
                const value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);

                setPhone(value);
              }}
              maxLength="10"
              required
            />

            {phone.length > 0 && phone.length !== 10 && (
              <p style={{ color: "red" }}>
                Phone number must contain exactly 10 digits.
              </p>
            )}

            {/* Course */}
            <input
              type="text"
              placeholder="Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />

            {/* Age */}
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="15"
              max="100"
              required
            />

            <div className="form-buttons">
              <button type="submit">
                {editingId !== null ? "Update Student" : "Save Student"}
              </button>

              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading && <p>Loading students...</p>}

      {/* Error */}
      {error && <p className="error-message">{error}</p>}

      {/* Student Table */}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>

                <td>
                  <div className="action-buttons">
                    {/* View */}
                    <button
                      className="view-button"
                      onClick={() =>
                        alert(
                          `Name: ${student.name}\n` +
                            `Email: ${student.email}\n` +
                            `Phone: ${student.phone}\n` +
                            `Course: ${student.course}\n` +
                            `Age: ${student.age}`
                        )
                      }
                    >
                      View
                    </button>

                    {/* Edit */}
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(student)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="5">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Students;
