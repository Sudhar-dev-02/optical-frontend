// API configuration derived from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const BILLS_API = `${API_BASE_URL}/bills`;
export const CATALOG_API = `${API_BASE_URL}/catalog`;
export const HEALTH_API = `${API_BASE_URL}/health`;

export default API_BASE_URL;
