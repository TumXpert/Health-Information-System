import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProgram = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Client-side validation
    if (!name || !startDate || !endDate) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    const newProgram = {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      status,
    };

    try {
      const response = await axios.post("/api/programs", newProgram);
      setSuccessMessage("Program added successfully!");
      console.log("Program added:", response.data);
      setTimeout(() => {
        history("/programs");
      }, 1500); // Redirect after 1.5 seconds
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Error adding program. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Add New Program</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Program Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Program Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="start_date" className="form-label">Start Date</label>
          <input
            type="date"
            id="start_date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="end_date" className="form-label">End Date</label>
          <input
            type="date"
            id="end_date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="d-flex justify-content-between pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`btn ${loading ? "btn-secondary" : "btn-primary"}`}
          >
            {loading ? "Adding..." : "Add Program"}
          </button>
          <button
            type="button"
            onClick={() => history("/programs")}
            className="btn btn-outline-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProgram;
