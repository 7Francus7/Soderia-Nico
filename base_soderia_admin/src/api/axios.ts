import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
       baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
       timeout: 15000,
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

              // Skip toast if caller wants to handle errors silently
              if (error.config?._silentError) {
                     return Promise.reject(error);
              }

              if (error.response?.status === 401) {
                     // Auto-logout: clear token and redirect
                     localStorage.removeItem('token');
                     localStorage.removeItem('username');
                     toast.error('Sesión expirada', { description: 'Por favor inicia sesión nuevamente', id: 'session-expired' });
                     // Use timeout to avoid redirect loops
                     setTimeout(() => {
                            if (window.location.pathname !== '/login') {
                                   window.location.href = '/login';
                            }
                     }, 500);
              } else if (error.response?.status === 403) {
                     toast.error('Acceso denegado', { description: 'No tienes permisos para realizar esta acción' });
              } else if (error.response?.status >= 500) {
                     toast.error('Error del servidor', { description: 'Intenta nuevamente más tarde' });
              }
              // Don't show generic toast for 4xx errors — let components handle those with specific messages
              // This prevents double-toasts when components already call toast.error()

              return Promise.reject(error);
       }
);

export default api;
