// API Endpoints Configuration

export const ENDPOINTS = {
  // Authentication & Authorization
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh'
  }
  // Add other feature endpoints here as the project grows...
} as const;
