import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const Program = () => {
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const userRole = "admin"; // Replace with actual role from auth context/state
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/programs");

      if (Array.isArray(res.data)) {
        setPrograms(res.data);
      } else if (Array.isArray(res.data.programs)) {
        setPrograms(res.data.programs);
      } else if (Array.isArray(res.data.data)) {
        setPrograms(res.data.data);
      } else {
        toast.error("Invalid data format received from server.");
        setPrograms([]);
      }
    } catch (err) {
      toast.error("Failed to fetch programs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this program?")) return;
    try {
      await axios.delete(`/api/programs/${id}`);
      setPrograms((prev) => prev.filter((p) => p._id !== id));
      toast.success("Program deleted successfully");
    } catch (err) {
      toast.error("Error deleting program");
    }
  };

  const filtered = programs.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container my-4">
      <ToastContainer />
      <div className="d-flex justify-content-between mb-4 align-items-center">
        <h1 className="h2">Programs</h1>
        <div className="d-flex gap-2">
          <button
            onClick={() => navigate("/programs/add")}
            className="btn btn-primary"
          >
            Add Program
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Back
          </button>
        </div>
      </div>

      <input
        className="form-control mb-4"
        placeholder="Search programs..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page on search
        }}
      />

      {loading ? (
        <div className="d-flex justify-content-center py-4">
          <FaSpinner className="animate-spin text-primary" style={{ fontSize: '2rem' }} />
        </div>
      ) : (
        <>
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((program, idx) => (
                  <tr key={program._id}>
                    <td className="text-center">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td>{program.name}</td>
                    <td>{program.description}</td>
                    <td className="text-center">
                      <button
                        onClick={() => navigate(`/programs/details/${program._id}`)}
                        className="btn btn-success btn-sm mx-1"
                      >
                        View
                      </button>
                      {userRole === "admin" && (
                        <>
                          <button
                            onClick={() => navigate(`/programs/edit/${program._id}`)}
                            className="btn btn-warning btn-sm mx-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(program._id)}
                            className="btn btn-danger btn-sm mx-1"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No programs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
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

export default Program;
