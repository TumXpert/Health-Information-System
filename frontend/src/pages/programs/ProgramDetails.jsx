import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const ProgramDetails = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!programId) {
      setError('Program ID is missing.');
      setLoading(false);
      return;
    }

    axios.get(`/api/programs/${programId}`)
      .then(res => {
        setProgram(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch program details. Please try again.');
        setLoading(false);
        toast.error('Failed to fetch program details.');
      });
  }, [programId]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      axios.delete(`/api/programs/${programId}`)
        .then(() => {
          toast.success('Program deleted successfully');
          navigate('/programs');
        })
        .catch(err => {
          console.error(err);
          setError('Failed to delete the program. Please try again.');
          toast.error('Failed to delete the program.');
        });
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;

  if (error) {
    return <div className="container mt-4 text-danger">{error}</div>;
  }

  if (!program) return <div className="container mt-4">Program not found.</div>;

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2>{program.name}</h2>
      <p><strong>Description:</strong> {program.description || 'No description available'}</p>
      <p><strong>Start Date:</strong> {program.start_date || 'N/A'}</p>
      <p><strong>End Date:</strong> {program.end_date || 'N/A'}</p>
      <p><strong>Status:</strong> {program.status || 'N/A'}</p>

      <button
        className="btn btn-warning me-2"
        onClick={() => navigate(`/programs/edit/${programId}`)}
      >
        Edit
      </button>
      <button
        className="btn btn-danger"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default ProgramDetails;
