import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api';

const API = axios.create({ baseURL });

export const getProgramById = (id) => API.get(`/programs/${id}`);
export const searchClients = (q) => API.get(`/clients/search?q=${q}`);
export const searchPrograms = (q) => API.get(`/programs/search?q=${q}`);
export const searchEnrollments = (client_id, program_id) =>
  API.get(`/enrollments/search?client_id=${client_id}&program_id=${program_id}`);

export default API;
