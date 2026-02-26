import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
       baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
       timeout: 10000,
});

api.interceptors.request.use(
       (config) => {
              const token = localStorage.getItem('token');
              if (token) {
                     config.headers.Authorization = `Bearer ${token}`;
              }
              return config;
       },
       (error) => Promise.reject(error)
);

api.interceptors.response.use(
       (response) => response,
       (error) => {
              const message = error.response?.data?.detail || error.message || 'Error desconocido';

              if (error.response?.status === 401) {
                     toast.error('Sesión expirada', { description: 'Por favor inicia sesión nuevamente' });
              } else if (error.response?.status === 403) {
                     toast.error('Acceso denegado', { description: 'No tienes permisos para realizar esta acción' });
              } else if (error.response?.status >= 500) {
                     toast.error('Error del servidor', { description: 'Intenta nuevamente más tarde' });
              } else {
                     toast.error('Error', { description: message });
              }

              return Promise.reject(error);
       }
);

export default api;
