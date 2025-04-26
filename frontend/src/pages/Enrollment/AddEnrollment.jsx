import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEnrollment = () => {
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [enrollmentDate, setEnrollmentDate] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch eligible clients
  useEffect(() => {
    axios.get('http://localhost:5000/api/enrollments/eligible-clients')
      .then(response => setClients(response.data))
      .catch(error => {
        console.error('There was an error fetching clients:', error);
        setError('Failed to load eligible clients.');
      });
  }, []);

  // Fetch available programs
  useEffect(() => {
    axios.get('http://localhost:5000/api/enrollments/available-programs')
      .then(response => setPrograms(response.data))
      .catch(error => {
        console.error('There was an error fetching programs:', error);
        setError('Failed to load available programs.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const formData = {
      client_id: selectedClient,
      program_id: selectedProgram,
      enrollment_date: enrollmentDate,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/enrollments/create', formData);
      setSuccessMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred while creating the enrollment.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add Enrollment</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <form onSubmit={handleSubmit} className="form-group">
        <div className="mb-3">
          <label htmlFor="client" className="form-label">Client</label>
          <select
            id="client"
            className="form-control"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            required
          >
            <option value="">Select Client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="program" className="form-label">Program</label>
          <select
            id="program"
            className="form-control"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            required
          >
            <option value="">Select Program</option>
            {programs.map(program => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="enrollmentDate" className="form-label">Enrollment Date</label>
          <input
            type="date"
            id="enrollmentDate"
            className="form-control"
            value={enrollmentDate}
            onChange={(e) => setEnrollmentDate(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">Create Enrollment</button>
      </form>
    </div>
  );
};

export default AddEnrollment;
