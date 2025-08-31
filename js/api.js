// Centralized API Config
const API_BASE = "/api";

const API = {
  LOGIN: `${API_BASE}/auth/login`,
  SIGNUP: `${API_BASE}/auth/signup`,
  COMPLAINTS: {
    CREATE: `${API_BASE}/complaints`,
    MY: `${API_BASE}/complaints/my`
  }
};