import { api } from './api';
import { apiRoutes } from '../routes/apiRoutes';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
  access_token: string;
  token_type: string;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>(apiRoutes.login, credentials);
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register a new user
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>(apiRoutes.register, data);
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post(apiRoutes.logout);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  // Get current authenticated user
  getCurrentUser: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    
    try {
      const response = await api.get(apiRoutes.user);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return null;
    }
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Get stored user data
  getUserData: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default authService;
