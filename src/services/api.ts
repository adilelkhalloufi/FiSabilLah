import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiRoutes } from '../routes/apiRoutes';

// Create axios instance with default config
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor to handle auth tokens if needed
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle specific error codes
    if (response) {
      switch (response.status) {
        case 401:
          // Handle unauthorized (potentially clear auth and redirect)
          localStorage.removeItem('auth_token');
          break;
        case 403:
          // Handle forbidden
          console.error('Access forbidden:', response.data.message);
          break;
        case 422:
          // Validation errors - can be handled by the component
          break;
        case 500:
          // Server errors
          console.error('Server error:', response.data.message);
          break;
        default:
          console.error('API error:', response.data.message || 'Unknown error');
      }
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.get<T>(url, config);
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, data, config);
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.put<T>(url, data, config);
  },
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.patch<T>(url, data, config);
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.delete<T>(url, config);
  },
  
  // File upload helper
  upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      }
    });
  },
};

// Resource-specific API helpers
export const chikhisApi = {
  getAll: () => api.get(apiRoutes.chikhis),
  getById: (id: string) => api.get(apiRoutes.getChikhi(id)),
  create: (data: FormData) => api.upload(apiRoutes.chikhis, data),
  update: (id: string, data: FormData) => api.upload(`${apiRoutes.chikhis}/${id}`, data),
  delete: (id: string) => api.delete(apiRoutes.getChikhi(id)),
};

export const subjectsApi = {
  getAll: () => api.get(apiRoutes.subjects),
  getById: (id: string) => api.get(apiRoutes.getSubject(id)),
  create: (data: any) => api.post(apiRoutes.subjects, data),
  update: (id: string, data: any) => api.put(apiRoutes.getSubject(id), data),
  delete: (id: string) => api.delete(apiRoutes.getSubject(id)),
};

export const videosApi = {
  getAll: () => api.get(apiRoutes.videos),
  getById: (id: string) => api.get(apiRoutes.getVideo(id)),
  create: (data: any) => api.post(apiRoutes.videos, data),
  update: (id: string, data: any) => api.put(apiRoutes.getVideo(id), data),
  delete: (id: string) => api.delete(apiRoutes.getVideo(id)),
};

export const tagsApi = {
  getAll: () => api.get(apiRoutes.tags),
  getById: (id: string) => api.get(apiRoutes.getTag(id)),
  create: (data: any) => api.post(apiRoutes.tags, data),
  update: (id: string, data: any) => api.put(apiRoutes.getTag(id), data),
  delete: (id: string) => api.delete(apiRoutes.getTag(id)),
};

export default api;
