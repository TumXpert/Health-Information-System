import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Fetch enrollments from the backend
  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/enrollments"); // Use the correct API endpoint
        setEnrollments(res.data);
      } catch (error) {
        toast.error("Failed to fetch enrollments.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Handle search
  const filteredEnrollments = enrollments.filter((enrollment) => {
    return (
      enrollment.client_id.toString().includes(searchTerm) ||
      enrollment.program_id.toString().includes(searchTerm)
    );
  });

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Delete this enrollment?")) {
      try {
        await axios.delete(`/api/enrollments/${id}`);
        setEnrollments(enrollments.filter((e) => e.id !== id));
        toast.success("Enrollment deleted.");
      } catch (err) {
        toast.error("Failed to delete enrollment.");
        console.error(err);
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);
  const paginatedEnrollments = filteredEnrollments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container my-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Enrollments</h2>
        <div className="d-flex gap-2">
          <button onClick={() => navigate("/enrollments/create")} className="btn btn-primary">
            Add Enrollment
          </button>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Back
          </button>
        </div>
      </div>

      {/* Search input */}
      <input
        className="form-control mb-3"
        placeholder="Search by client or program..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-4">
          <FaSpinner className="animate-spin" size={30} />
        </div>
      ) : (
        <>
          {/* Table displaying enrollments */}
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Client ID</th>
                <th>Program ID</th>
                <th>Enrollment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEnrollments.length > 0 ? (
                paginatedEnrollments.map((enrollment, idx) => (
                  <tr key={enrollment.id}>
                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td>{enrollment.client_id}</td>
                    <td>{enrollment.program_id}</td>
                    <td>{new Date(enrollment.enrollment_date).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/enrollments/edit/${enrollment.id}`)}
                        className="btn btn-warning btn-sm mx-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(enrollment.id)}
                        className="btn btn-danger btn-sm mx-1"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No enrollments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn btn-outline-secondary"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Enrollments;
