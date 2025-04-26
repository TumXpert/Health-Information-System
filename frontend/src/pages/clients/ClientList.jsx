import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  
  useEffect(() => {
    fetchClients();
  }, [page, searchQuery, genderFilter]);

  const fetchClients = async () => {
    const response = await fetch(
      `http://localhost:5000/api/clients?page=${page}&q=${searchQuery}&gender=${genderFilter}`
    );
    const data = await response.json();
    setClients(data.clients);
    setTotalPages(data.pagination.total_pages);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to the first page
  };

  const handleGenderFilter = (event) => {
    setGenderFilter(event.target.value);
    setPage(1); // Reset to the first page
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Clients</h2>
      
      <div className="d-flex mb-3">
        <input 
          type="text" 
          className="form-control mr-2" 
          placeholder="Search clients..." 
          value={searchQuery}
          onChange={handleSearch}
        />
        <select 
          className="form-control" 
          value={genderFilter}
          onChange={handleGenderFilter}
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="list-group">
        {clients.map(client => (
          <div className="list-group-item" key={client.id}>
            <h5 className="mb-1">{client.full_name}</h5>
            <p className="mb-1">Gender: {client.gender}</p>
            <Link to={`/clients/${client.id}`} className="btn btn-info btn-sm">View Details</Link>
          </div>
        ))}
      </div>

      <div className="pagination mt-3">
        <button 
          onClick={() => handlePageChange(page - 1)} 
          className="btn btn-secondary"
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="mx-3">Page {page} of {totalPages}</span>
        <button 
          onClick={() => handlePageChange(page + 1)} 
          className="btn btn-secondary"
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClientsList;
