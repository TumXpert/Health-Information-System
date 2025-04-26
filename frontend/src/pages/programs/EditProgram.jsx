import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProgram = () => {
  const { programId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Active',
  });

  const [loading, setLoading] = useState(true);       // For fetching program
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!programId) {
      setError('Program ID is missing.');
      return;
    }

    axios.get(`/api/programs/${programId}`)
      .then(res => {
        setProgram(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch program details.');
        toast.error('Failed to fetch program details.');
        setLoading(false);
      });
  }, [programId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgram(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    axios.put(`/api/programs/${programId}`, program)
      .then(() => {
        toast.success('Program updated successfully!');
        setSubmitting(false);
        setTimeout(() => navigate(`/programs/details/${programId}`), 1500);
      })
      .catch(err => {
        console.error(err);
        toast.error('Error updating program. Please try again.');
        setSubmitting(false);
      });
  };

  if (loading) return <div className="text-center mt-5">Loading program details...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Program</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Program Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={program.name}
            onChange={handleChange}
            className="form-control"
            required
            disabled={submitting}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={program.description}
            onChange={handleChange}
            className="form-control"
            required
            disabled={submitting}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="start_date" className="form-label">Start Date</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={program.start_date}
            onChange={handleChange}
            className="form-control"
            required
            disabled={submitting}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="end_date" className="form-label">End Date</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={program.end_date}
            onChange={handleChange}
            className="form-control"
            required
            disabled={submitting}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            name="status"
            value={program.status}
            onChange={handleChange}
            className="form-select"
            required
            disabled={submitting}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProgram;
