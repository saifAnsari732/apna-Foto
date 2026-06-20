export const BASE_URL = 'https://apna-foto.onrender.com/api';

export const API_ENDPOINTS = {
  login: `${BASE_URL}/auth/login`,
  signup: `${BASE_URL}/auth/register`,
  createOrder: `${BASE_URL}/payment/create-order`,
  generatePoster: `${BASE_URL}/ai/generate`,
};

export const apiCall = async (url, method = 'GET', body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    method,
    headers,
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }
  
  return data;
};

export const loginAPI = (email, password) => apiCall(API_ENDPOINTS.login, 'POST', { email, password });
export const signupAPI = (name, email, password) => apiCall(API_ENDPOINTS.signup, 'POST', { name, email, password });
export const createOrderAPI = (amount, token) => apiCall(API_ENDPOINTS.createOrder, 'POST', { amount }, token);
export const generatePosterAPI = (prompt, token) => apiCall(API_ENDPOINTS.generatePoster, 'POST', { prompt }, token);
