


import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const TRAINER_API = "/students/api/trainers/";

  // Fetch trainers
  const fetchTrainers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(TRAINER_API);
      setTrainers(response.data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      setError("Unable to load trainers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  // Add trainer with validation
  const handleAddTrainer = async (e) => {
    e.preventDefault();

    // Name validation: only letters and spaces
    if (!/^[A-Za-z ]+$/.test(name.trim())) {
      alert("Trainer name can contain only letters and spaces!");
      return;
    }

    // Email validation: Gmail only
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim())) {
      alert("Please enter a valid Gmail address!");
      return;
    }

    // Phone validation: exactly 10 digits
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number must contain exactly 10 digits!");
      return;
    }

    try {
      const trainerData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone,
      };

      await axiosInstance.post(TRAINER_API, trainerData);

      alert("Trainer added successfully!");

      setName("");
      setEmail("");
      setPhone("");
      setShowForm(false);

      await fetchTrainers();
    } catch (error) {
      console.error("Error adding trainer:", error);

      if (error.response?.data) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Failed to add trainer. Please try again.");
      }
    }
  };

  // Delete trainer
  const handleDeleteTrainer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trainer?"
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`${TRAINER_API}${id}/`);

      alert("Trainer deleted successfully!");

      await fetchTrainers();
    } catch (error) {
      console.error("Error deleting trainer:", error);
      alert("Failed to delete trainer.");
    }
  };

  return (
    <div className="courses-container">
      <h1>Trainer Management</h1>
      <p>Manage college trainers</p>

      {/* Add Trainer Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {showForm ? "Cancel" : "+ Add Trainer"}
      </button>

      {/* Add Trainer Form */}
      {showForm && (
        <form
          onSubmit={handleAddTrainer}
          style={{
            marginBottom: "25px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>Add New Trainer</h2>

          {/* Trainer Name */}
          <div style={{ marginBottom: "15px" }}>
            <label>Trainer Name</label>

            <input
              type="text"
              placeholder="Enter trainer name"
              value={name}
              onChange={(e) => {
                const value = e.target.value;

                if (/^[A-Za-z ]*$/.test(value)) {
                  setName(value);
                }
              }}
              required
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "15px" }}>
            <label>Email (Gmail only)</label>

            <input
              type="email"
              placeholder="Enter Gmail address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "15px" }}>
            <label>Phone Number (10 digits)</label>

            <input
              type="tel"
              placeholder="Enter 10-digit phone number"
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
              <p style={{ color: "red", marginTop: "5px" }}>
                Phone number must contain exactly 10 digits.
              </p>
            )}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Save Trainer
          </button>
        </form>
      )}

      {/* Loading */}
      {loading && <p>Loading trainers...</p>}

      {/* Error */}
      {error && <p className="error-message">{error}</p>}

      {/* Trainers Table */}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Trainer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {trainers.map((trainer) => (
              <tr key={trainer.id}>
                <td>{trainer.id}</td>
                <td>{trainer.name}</td>
                <td>{trainer.email}</td>
                <td>{trainer.phone}</td>

                <td>
                  <button
                    onClick={() => handleDeleteTrainer(trainer.id)}
                    style={{
                      padding: "7px 12px",
                      backgroundColor: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {trainers.length === 0 && (
              <tr>
                <td colSpan="5">No trainers available.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Trainers;
