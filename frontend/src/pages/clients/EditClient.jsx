import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditClient = () => {
  const { clientId } = useParams(); // Get clientId from URL
  const [clientData, setClientData] = useState({
    full_name: '',
    gender: [],
    date_of_birth: '',
    phone_number: '',
    address: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch client data by clientId
    fetch(`http://localhost:5000/api/clients/${clientId}/`)
      .then(response => response.json())
      .then(data => setClientData(data))
      .catch(err => console.log(err));
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox for gender field
    if (type === 'checkbox') {
      if (checked) {
        setClientData(prevState => ({
          ...prevState,
          gender: [...prevState.gender, value]
        }));
      } else {
        setClientData(prevState => ({
          ...prevState,
          gender: prevState.gender.filter(gender => gender !== value)
        }));
      }
    } else {
      setClientData({ ...clientData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Submit updated client data
    fetch(`http://localhost:5000/api/clients/${clientId}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    })
      .then(response => response.json())
      .then(() => {
        navigate('/clients');  // Redirect to client list after successful update
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Edit Client</h2>
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            name="full_name"
            value={clientData.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Gender</label>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="gender"
              value="Male"
              checked={clientData.gender.includes('Male')}
              onChange={handleChange}
            />
            <label className="form-check-label">Male</label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="gender"
              value="Female"
              checked={clientData.gender.includes('Female')}
              onChange={handleChange}
            />
            <label className="form-check-label">Female</label>
          </div>
        </div>

        <div className="mb-3">
          <label>Date of Birth</label>
          <input
            type="date"
            className="form-control"
            name="date_of_birth"
            value={clientData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Phone Number</label>
          <input
            type="text"
            className="form-control"
            name="phone_number"
            value={clientData.phone_number}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Address</label>
          <textarea
            className="form-control"
            name="address"
            value={clientData.address}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Update Client</button>
      </form>
    </div>
  );
};

export default EditClient;
