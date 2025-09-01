const API_BASE = "/api/auth";

const API = {
  LOGIN: `${API_BASE}/login`,
  SIGNUP: `${API_BASE}/signup`,
  VERIFY: `${API_BASE}/verify`,
  FORGOT_PASSWORD: `${API_BASE}/forgot-password`,   // send OTP
  RESET_PASSWORD: `${API_BASE}/reset-password`,     // verify OTP + reset password
  COMPLAINTS: {
    CREATE: "/api/complaints/create",
    MY: "/api/complaints/my"
  }
};