import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ClientDetails = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [programId, setProgramId] = useState('');

  const fetchClient = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch client details');
      }
      const data = await response.json();
      setClient(data);
    } catch (error) {
      console.error('Error fetching client:', error);
      toast.error(error.message || 'Failed to load client details');
    }
  }, [clientId]);

  const fetchEnrollments = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/enrollments/client/${clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch enrollments');
      }
      const data = await response.json();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error(error.message || 'Failed to load enrollments');
    }
  }, [clientId]);

  const fetchPrograms = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/programs`);
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      const data = await response.json();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error(error.message || 'Failed to load programs');
    }
  }, []);

  useEffect(() => {
    fetchClient();
    fetchEnrollments();
    fetchPrograms();
  }, [fetchClient, fetchEnrollments, fetchPrograms]);

  const handleEnroll = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          program_id: programId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enroll');
      }

      toast.success('Enrolled successfully!');
      fetchEnrollments(); // Refresh the enrollment list
      setShowModal(false);
      setProgramId('');
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error(error.message || 'Enrollment failed');
    }
  };

  if (!client) {
    return <div className="text-center my-5">Loading client details...</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Client Details</h2>

      <Link to="/clients" className="btn btn-secondary mb-3">
        Back to Clients
      </Link>

      {/* Client Details Card */}
      <div className="card mx-auto w-50 mb-4">
        <div className="card-body">
          <h5 className="card-title">{client.full_name}</h5>
          <p><strong>Gender:</strong> {client.gender}</p>
          <p><strong>Date of Birth:</strong> {client.date_of_birth}</p>
          <p><strong>Phone Number:</strong> {client.phone_number}</p>
          <p><strong>Address:</strong> {client.address}</p>

          <Link to={`/clients/edit/${client.id}`} className="btn btn-warning btn-sm">
            Edit
          </Link>
        </div>
      </div>

      {/* Enrollments Section */}
      <div className="card mx-auto w-50 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Enrolled Programs</h5>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              Enroll in New Program
            </button>
          </div>

          {enrollments.length > 0 ? (
            <ul className="list-group list-group-flush">
              {enrollments.map((enrollment) => (
                <li key={enrollment.id} className="list-group-item">
                  {enrollment.program_name}
                  <small className="text-muted d-block">
                    Enrolled on: {enrollment.enrollment_date}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">This client is not enrolled in any programs yet.</p>
          )}
        </div>
      </div>

      {/* Modal for enrolling in a program */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Enroll in Program</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Select Program</label>
                  <select
                    className="form-select"
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    {programs.length > 0 ? (
                      programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No programs available</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleEnroll}
                  disabled={!programId}
                >
                  Enroll
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
