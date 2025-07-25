import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

// Configure axios base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9500';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  console.log('=== REQUEST INTERCEPTOR START ===');
  console.log('Request URL:', config.url);
  console.log('Request method:', config.method);
  
  const token = getToken();
  console.log('Token from getToken():', token ? `${token.substring(0, 20)}...` : 'No token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
    console.log('Full headers:', config.headers);
  } else {
    console.log('No token found, skipping Authorization header');
  }
  
  console.log('=== REQUEST INTERCEPTOR END ===');
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      removeToken();
      // Only redirect if we're not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response:', response.data);
    
    // Store token if it exists in the response
    if (response.data.token) {
      console.log('Token received, storing...');
      localStorage.setItem('authToken', response.data.token);
      console.log('Token stored successfully');
    } else {
      console.warn('No token in login response');
    }
    
    return response.data;
  },

  signup: async (email: string, password: string, username: string) => {
    console.log('Signup attempt for:', email);
    const response = await api.post('/auth/signup', { 
      email, 
      password,
      username
    });
    console.log('Signup response:', response.data);
    
    // Store token if it exists in the response
    if (response.data.data && response.data.data.token) {
      console.log('Token received from signup, storing...');
      localStorage.setItem('authToken', response.data.data.token);
      console.log('Token stored successfully');
    } else {
      console.warn('No token in signup response');
    }
    
    return response.data;
  },

  logout: () => {
    console.log('Logout called, removing token');
    removeToken();
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    console.log('getCurrentUser called');
    const response = await api.get('/auth/me');
    console.log('getCurrentUser response:', response.data);
    return response.data;
  },

  // Debug function to test token
  testToken: () => {
    const token = localStorage.getItem('authToken');
    console.log('Current token in localStorage:', token ? `${token.substring(0, 20)}...` : 'No token');
    return token;
  },
};

// Patient API
export const patientAPI = {
  getAll: async () => {
    const response = await api.get('/patients');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  create: async (patientData: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    hospital_id: number;
  }) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  update: async (id: number, patientData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};

// Patient Registration API - Updated
export const patientRegistrationAPI = {
  getAll: async () => {
    const response = await api.get('/patients/patient-registrations/');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/patients/patient-registrations/${id}`);
    return response.data;
  },

  create: async (registrationData: any) => {
    const response = await api.post('/patients/patient-registrations/', registrationData);
    return response.data;
  },

  update: async (id: number, registrationData: any) => {
    const response = await api.put(`/patients/patient-registrations/${id}`, registrationData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/patients/patient-registrations/${id}`);
    return response.data;
  },
};

// Hospital API
export const hospitalAPI = {
  getAll: async () => {
    const response = await api.get('/hospitals');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/hospitals/${id}`);
    return response.data;
  },
};

// Department API
export const departmentAPI = {
  getAll: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  getByHospitalId: async (hospitalId: number) => {
    const response = await api.get(`/hospitals/${hospitalId}/departments`);
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (taskData: any) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  update: async (id: number, taskData: any) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
};

export default api; 