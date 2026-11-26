function Admin() {
  return (
    <div className="admin-container">
      <h1>Admin Settings</h1>
      <p className="admin-subtitle">Manage your College Portal</p>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>Student Management</h2>
          <p>Manage student records and information.</p>
        </div>

        <div className="admin-card">
          <h2>Course Management</h2>
          <p>Add and manage college courses.</p>
        </div>

        <div className="admin-card">
          <h2>Portal Overview</h2>
          <p>View college portal information and dashboard statistics.</p>
        </div>
      </div>
    </div>
  );
}

export default Admin;