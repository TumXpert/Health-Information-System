import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const EditEnrollment = () => {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    client_id: "",
    program_id: "",
    enrollment_date: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("/api/clients");
        // Ensure that the response is an array
        setClients(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };

    const fetchPrograms = async () => {
      try {
        const res = await axios.get("/api/programs");
        setPrograms(res.data);  // Assuming programs are always an array
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };

    const fetchEnrollment = async () => {
      try {
        const res = await axios.get(`/api/enrollments/${enrollmentId}`);
        const enrollment = res.data;
        setFormData({
          client_id: enrollment.client_id._id,
          program_id: enrollment.program_id._id,
          enrollment_date: enrollment.enrollment_date.slice(0, 10),
          status: enrollment.status,
        });
      } catch (err) {
        console.error("Error fetching enrollment:", err);
        toast.error("Failed to load enrollment data.");
      }
    };

    fetchClients();
    fetchPrograms();
    fetchEnrollment();
  }, [enrollmentId]); // Now includes enrollmentId

  const validate = () => {
    const err = {};
    if (!formData.client_id) err.client_id = "Client is required";
    if (!formData.program_id) err.program_id = "Program is required";
    if (!formData.enrollment_date) err.enrollment_date = "Date is required";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      await axios.put(`/api/enrollments/${enrollmentId}`, formData);
      toast.success("Enrollment updated successfully!");
      navigate("/enrollments");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update enrollment.");
    }
  };

  return (
    <div className="container my-4">
      <ToastContainer />
      <h2>Edit Enrollment</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        {/* Client */}
        <div className="mb-3">
          <label className="form-label">Client</label>
          <select
            className={`form-select ${errors.client_id ? "is-invalid" : ""}`}
            value={formData.client_id}
            onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
          >
            <option value="">-- Select Client --</option>
            {clients.length > 0 ? (
              clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))
            ) : (
              <option disabled>No clients available</option>
            )}
          </select>
          {errors.client_id && <div className="invalid-feedback">{errors.client_id}</div>}
        </div>

        {/* Program */}
        <div className="mb-3">
          <label className="form-label">Program</label>
          <select
            className={`form-select ${errors.program_id ? "is-invalid" : ""}`}
            value={formData.program_id}
            onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
          >
            <option value="">-- Select Program --</option>
            {programs.length > 0 ? (
              programs.map((program) => (
                <option key={program._id} value={program._id}>
                  {program.name}
                </option>
              ))
            ) : (
              <option disabled>No programs available</option>
            )}
          </select>
          {errors.program_id && <div className="invalid-feedback">{errors.program_id}</div>}
        </div>

        {/* Date */}
        <div className="mb-3">
          <label className="form-label">Enrollment Date</label>
          <input
            type="date"
            className={`form-control ${errors.enrollment_date ? "is-invalid" : ""}`}
            value={formData.enrollment_date}
            onChange={(e) => setFormData({ ...formData, enrollment_date: e.target.value })}
          />
          {errors.enrollment_date && (
            <div className="invalid-feedback">{errors.enrollment_date}</div>
          )}
        </div>

        {/* Status */}
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Update Enrollment
          </button>
          <button type="button" onClick={() => navigate("/enrollments")} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEnrollment;
