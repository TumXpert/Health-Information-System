import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const EnrollmentDetails = () => {
  const { enrollmentId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrollmentDetails = async () => {
      try {
        const response = await axios.get(`/api/enrollments/${enrollmentId}`);
        setEnrollment(response.data);
      } catch (error) {
        toast.error("Failed to fetch enrollment details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentDetails();
  }, [enrollmentId]);

  if (loading) return <div className="text-center py-4">Loading...</div>;

  if (!enrollment) {
    return <div className="text-center py-4">No details found for this enrollment.</div>;
  }

  return (
    <div className="container my-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Enrollment Details</h2>
        <button onClick={() => navigate("/enrollments")} className="btn btn-secondary">
          Back to Enrollments
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Enrollment Information</h5>
          <p><strong>Client:</strong> {enrollment.client_name}</p>
          <p><strong>Program:</strong> {enrollment.program_name}</p>
          <p><strong>Status:</strong> {enrollment.status || "N/A"}</p>
          <p><strong>Enrollment Date:</strong> {enrollment.enrollment_date ? new Date(enrollment.enrollment_date).toLocaleDateString() : "N/A"}</p>
          <p><strong>Details:</strong> {enrollment.details || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDetails;
