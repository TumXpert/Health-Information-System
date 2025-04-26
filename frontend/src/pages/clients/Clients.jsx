import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const query = search ? `&q=${encodeURIComponent(search)}` : "";
    fetch(`http://localhost:5000/api/clients/?page=${page}${query}`)
      .then(response => response.json())
      .then(data => {
        setClients(data.clients || []);
        setPages(data.pages || 1);
      })
      .catch(err => console.error("Failed to fetch clients:", err));
  }, [page, search]);

  const handleDelete = (clientId) => {
    fetch(`http://localhost:5000/api/clients/${clientId}/`, {
      method: 'DELETE',
    })
      .then(() => {
        setClients(clients.filter(client => client.id !== clientId));
      })
      .catch(err => console.error("Delete failed:", err));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);  // Reset to first page on new search
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Client List</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/clients/add" className="btn btn-primary me-2">Add New Client</Link>
          <Link to="/" className="btn btn-secondary">Back</Link>
        </div>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No clients found</td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.id}>
                  <td>{client.full_name}</td>
                  <td>{client.gender}</td>
                  <td>{client.phone_number}</td>
                  <td>
                    <Link to={`/clients/${client.id}`} className="btn btn-info btn-sm">View</Link>
                    <Link to={`/clients/edit/${client.id}`} className="btn btn-warning btn-sm ms-2">Edit</Link>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="btn btn-danger btn-sm ms-2">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination with arrows */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(prev => Math.max(prev - 1, 1))}>
                &laquo; Prev
              </button>
            </li>
            {[...Array(pages)].map((_, i) => (
              <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${page === pages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(prev => Math.min(prev + 1, pages))}>
                Next &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Clients;
