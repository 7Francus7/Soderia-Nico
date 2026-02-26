import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginView() {
       const [username, setUsername] = useState('');
       const [password, setPassword] = useState('');
       const [loading, setLoading] = useState(false);
       const [error, setError] = useState<string | null>(null);
       const [showPassword, setShowPassword] = useState(false);
       const { login } = useAuth();
       const navigate = useNavigate();

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              try {
                     const formData = new URLSearchParams();
                     formData.append('username', username);
                     formData.append('password', password);

                     const response = await api.post('/auth/access-token', formData, {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                     });

                     login(response.data.access_token, username);
                     navigate('/');
              } catch (err: any) {
                     setError('Credenciales inválidas o error de conexión.');
              } finally {
                     setLoading(false);
              }
       };

       return (
              <div className="login-bg min-h-screen flex items-center justify-center p-4">
                     {/* Floating orbs background */}
                     <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
                            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float" />
                            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
                            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
                     </div>

                     <div className="relative z-10 w-full max-w-md animate-scale-in">
                            {/* Card */}
                            <div className="glass-dark rounded-3xl p-8 md:p-10 shadow-2xl">
                                   {/* Logo & Title */}
                                   <div className="text-center mb-8">
                                          <div className="relative inline-flex mb-5">
                                                 <div className="w-18 h-18 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/25" style={{ width: 72, height: 72 }}>
                                                        <span className="text-4xl">🧃</span>
                                                 </div>
                                                 {/* Glow ring */}
                                                 <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl opacity-20 blur-lg" />
                                          </div>
                                          <h1 className="text-3xl font-extrabold text-white mb-1.5 tracking-tight">
                                                 Soderí<span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">a Nico</span>
                                          </h1>
                                          <p className="text-slate-400 text-sm font-medium">Sistema de Gestión Integral</p>
                                   </div>

                                   {/* Error */}
                                   {error && (
                                          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl mb-6 text-sm flex items-center gap-2.5 animate-fade-in">
                                                 <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-red-400 text-lg">!</span>
                                                 </div>
                                                 <span>{error}</span>
                                          </div>
                                   )}

                                   {/* Form */}
                                   <form onSubmit={handleSubmit} className="space-y-5">
                                          <div className="space-y-1.5">
                                                 <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">Usuario</label>
                                                 <div className="relative group">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center group-focus-within:bg-blue-600/20 transition-colors">
                                                               <User className="w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                        </div>
                                                        <input
                                                               type="text"
                                                               value={username}
                                                               onChange={(e) => setUsername(e.target.value)}
                                                               className="login-input"
                                                               placeholder="Ingresá tu usuario"
                                                               required
                                                               autoFocus
                                                        />
                                                 </div>
                                          </div>

                                          <div className="space-y-1.5">
                                                 <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">Contraseña</label>
                                                 <div className="relative group">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center group-focus-within:bg-blue-600/20 transition-colors">
                                                               <Lock className="w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                        </div>
                                                        <input
                                                               type={showPassword ? "text" : "password"}
                                                               value={password}
                                                               onChange={(e) => setPassword(e.target.value)}
                                                               className="login-input"
                                                               style={{ paddingRight: '48px' }}
                                                               placeholder="••••••••"
                                                               required
                                                        />
                                                        <button
                                                               type="button"
                                                               onClick={() => setShowPassword(!showPassword)}
                                                               className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-700/50"
                                                               tabIndex={-1}
                                                        >
                                                               {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                 </div>
                                          </div>

                                          <button
                                                 type="submit"
                                                 disabled={loading}
                                                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden mt-2"
                                          >
                                                 {/* Shimmer effect on hover */}
                                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                                                 <span className="relative z-10 flex items-center gap-2">
                                                        {loading ? (
                                                               <Loader2 className="animate-spin h-5 w-5" />
                                                        ) : (
                                                               <>
                                                                      Ingresar al Sistema
                                                                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                               </>
                                                        )}
                                                 </span>
                                          </button>
                                   </form>

                                   {/* Footer */}
                                   <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                                          <p className="text-slate-500 text-xs">
                                                 Sodería Nico © {new Date().getFullYear()} · Panel Administrativo
                                          </p>
                                   </div>
                            </div>
                     </div>
              </div>
       );
}
