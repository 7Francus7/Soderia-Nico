import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Lock, Loader2 } from 'lucide-react';

export default function LoginView() {
       const [username, setUsername] = useState('');
       const [password, setPassword] = useState('');
       const [loading, setLoading] = useState(false);
       const [error, setError] = useState<string | null>(null);
       const { login } = useAuth();
       const navigate = useNavigate();

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              try {
                     // Form encoded for OAuth2PasswordRequestForm
                     const formData = new URLSearchParams();
                     formData.append('username', username);
                     formData.append('password', password);

                     const response = await api.post('/auth/access-token', formData, {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                     });

                     login(response.data.access_token, username);
                     navigate('/'); // Go to dashboard
              } catch (err: any) {
                     setError('Credenciales inválidas o error de conexión.');
              } finally {
                     setLoading(false);
              }
       };

       return (
              <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                     <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
                            <div className="text-center mb-8">
                                   <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
                                          <span className="text-3xl">🧃</span>
                                   </div>
                                   <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Soderí<span className="text-blue-500">a Nico</span></h1>
                                   <p className="text-slate-400 text-sm">Sistema de Gestión Integral</p>
                            </div>

                            {error && (
                                   <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
                                          {error}
                                   </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                   <div className="space-y-2">
                                          <label className="text-sm font-medium text-slate-300">Usuario</label>
                                          <div className="relative">
                                                 <User className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                                                 <input
                                                        type="text"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                        placeholder="admin"
                                                        required
                                                 />
                                          </div>
                                   </div>

                                   <div className="space-y-2">
                                          <label className="text-sm font-medium text-slate-300">Contraseña</label>
                                          <div className="relative">
                                                 <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                                                 <input
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                        placeholder="••••••••"
                                                        required
                                                 />
                                          </div>
                                   </div>

                                   <button
                                          type="submit"
                                          disabled={loading}
                                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition duration-300 transform hover:scale-[1.02] flex items-center justify-center shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                   >
                                          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Ingresar al Sistema"}
                                   </button>
                            </form>
                     </div>
              </div>
       );
}
