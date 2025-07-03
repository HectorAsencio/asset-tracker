import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/deposits';

// Get all deposits
export const getAllDeposits = () => {
  return axios.get(`${API_BASE_URL}/`);
};

// Get a single deposit by ID
export const getDeposit = (id) => {
  return axios.get(`${API_BASE_URL}/${id}/`);
};

// Create a new deposit
export const createDeposit = (depositData) => {
  return axios.post(`${API_BASE_URL}/`, depositData);
};

// Update an existing deposit
export const updateDeposit = (id, depositData) => {
  return axios.put(`${API_BASE_URL}/${id}/`, depositData);
};

// Partially update a deposit
export const patchDeposit = (id, depositData) => {
  return axios.patch(`${API_BASE_URL}/${id}/`, depositData);
};

// Delete a deposit
export const deleteDeposit = (id) => {
  return axios.delete(`${API_BASE_URL}/${id}/`);
};
