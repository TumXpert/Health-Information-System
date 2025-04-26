import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch programs from backend
  const fetchPrograms = async () => {
    try {
      const response = await axios.get("/api/programs");
      setPrograms(response.data);
    } catch (error) {
      console.error("Failed to fetch programs", error);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Delete a program
  const deleteProgram = async (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        await axios.delete(`/api/programs/${id}`);
        setPrograms(programs.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Failed to delete program", error);
      }
    }
  };

  // Filtered programs
  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Programs</h1>

      {/* Search Bar and Actions */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search programs..."
          className="border px-3 py-2 rounded w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="space-x-2">
          <button
            onClick={() => navigate.push("/programs/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Program
          </button>
          <button
            onClick={() => navigate.goBack()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>

      {/* Program Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border text-left">Program Name</th>
              <th className="py-2 px-4 border text-left">Description</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program, index) => (
                <tr key={program._id} className="border-b">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{program.name}</td>
                  <td className="py-2 px-4 border">{program.description}</td>
                  <td className="py-2 px-4 border space-x-2 text-center">
                    <button
                      onClick={() => navigate.push(`/programs/details/${program._id}`)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate.push(`/programs/edit/${program._id}`)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProgram(program._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No programs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgramList;
