
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

  // Profile image
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

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

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );

  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;

  const currentStudents = filteredStudents.slice(
    startIndex,
    endIndex
  );

  // Reset pagination when searching
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Change page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCourse("");
    setAge("");

    setImageFile(null);
    setImagePreview("");

    setEditingId(null);
    setShowForm(false);
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);

    // Preview selected image
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Edit student
  const handleEdit = (student) => {
    setEditingId(student.id);

    setName(student.name || "");
    setEmail(student.email || "");
    setPhone(String(student.phone || ""));
    setCourse(student.course || "");
    setAge(String(student.age || ""));

    setImageFile(null);

    // Show existing image
    if (student.profile_image) {
      const imageUrl = student.profile_image.startsWith("http")
        ? student.profile_image
        : `http://127.0.0.1:8000${student.profile_image}`;

      setImagePreview(imageUrl);
    } else {
      setImagePreview("");
    }

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
    if (!/^[A-Za-z ]+$/.test(name.trim())) {
      alert("Student name can contain only letters and spaces!");
      return false;
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim())) {
      alert("Please enter a valid Gmail address ending with @gmail.com!");
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number must contain exactly 10 digits!");
      return false;
    }

    const studentAge = Number(age);

    if (!age || studentAge < 15 || studentAge > 100) {
      alert("Age must be between 15 and 100!");
      return false;
    }

    if (!course.trim()) {
      alert("Please enter the course!");
      return false;
    }

    return true;
  };

  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStudent()) {
      return;
    }

    // FormData is required for image uploads
    const studentData = new FormData();

    studentData.append("name", name.trim());
    studentData.append("email", email.trim());
    studentData.append("phone", phone);
    studentData.append("course", course.trim());
    studentData.append("age", Number(age));

    // Append image only if a new image was selected
    if (imageFile) {
      studentData.append("profile_image", imageFile);
    }

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
      setCurrentPage(1);

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

  // Image URL helper
  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `http://127.0.0.1:8000${image}`;
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
          onChange={(e) => handleSearch(e.target.value)}
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
          <h2>
            {editingId !== null ? "Edit Student" : "Add New Student"}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <input
              type="text"
              placeholder="Student Name"
              value={name}
              onChange={(e) => {
                const value = e.target.value;

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

            {/* Profile Image Upload */}
            <div style={{ marginTop: "15px", marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Profile Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <p style={{ fontSize: "13px", color: "#666" }}>
                Maximum file size: 5 MB
              </p>

              {/* Image Preview */}
              {imagePreview && (
                <div style={{ marginTop: "15px" }}>
                  <p>Image Preview:</p>

                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "2px solid #ddd",
                    }}
                  />
                </div>
              )}
            </div>

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
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>

                  {/* Profile Image */}
                  <td>
                    {student.profile_image ? (
                      <img
                        src={getImageUrl(student.profile_image)}
                        alt={student.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          backgroundColor: "#e5e7eb",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontWeight: "bold",
                          color: "#555",
                        }}
                      >
                        {student.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>

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

              {currentStudents.length === 0 && (
                <tr>
                  <td colSpan="6">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                marginTop: "25px",
                flexWrap: "wrap",
              }}
            >
              {/* Previous */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "12px 22px",
                  fontSize: "18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  style={{
                    padding: "12px 18px",
                    fontSize: "18px",
                    minWidth: "48px",
                    borderRadius: "8px",
                    backgroundColor:
                      currentPage === index + 1 ? "#2563eb" : "#6b7280",
                    color: "white",
                    fontWeight:
                      currentPage === index + 1 ? "bold" : "normal",
                    cursor: "pointer",
                  }}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "12px 22px",
                  fontSize: "18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}

          {/* Pagination Information */}
          {filteredStudents.length > 0 && (
            <p
              style={{
                textAlign: "center",
                marginTop: "18px",
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              Showing {startIndex + 1}–
              {Math.min(endIndex, filteredStudents.length)} of{" "}
              {filteredStudents.length} students
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Students;