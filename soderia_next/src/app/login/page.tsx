"use strict";
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
       const [username, setUsername] = useState("");
       const [password, setPassword] = useState("");
       const [loading, setLoading] = useState(false);
       const router = useRouter();

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              setLoading(true);

              const result = await signIn("credentials", {
                     username,
                     password,
                     redirect: false,
              });

              if (result?.error) {
                     toast.error("Credenciales incorrectas");
                     setLoading(false);
              } else {
                     toast.success("Bienvenido al sistema");
                     router.push("/");
                     router.refresh();
              }
       };

       return (
              <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                     {/* Background Orbs */}
                     <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                     <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

                     <div className="relative z-10 w-full max-w-md animate-fade-in-up">
                            <div className="text-center mb-10 space-y-2">
                                   <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto mb-6 shadow-2xl shadow-primary/20 border border-primary/20">
                                          <ShieldCheck className="w-10 h-10" />
                                   </div>
                                   <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Acceso Seguro</h1>
                                   <p className="text-slate-500 font-medium">Sodería Nico - Panel de Control</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                   <div className="space-y-4">
                                          <div className="relative group">
                                                 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                                 <input
                                                        type="text"
                                                        placeholder="Nombre de usuario"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        required
                                                        className="w-full h-16 bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-700"
                                                 />
                                          </div>

                                          <div className="relative group">
                                                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                                 <input
                                                        type="password"
                                                        placeholder="Contraseña"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        className="w-full h-16 bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-700"
                                                 />
                                          </div>
                                   </div>

                                   <Button
                                          disabled={loading}
                                          type="submit"
                                          className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black tracking-widest uppercase shadow-2xl shadow-primary/20 transition-all active:scale-95"
                                   >
                                          {loading ? (
                                                 <Loader2 className="w-6 h-6 animate-spin" />
                                          ) : (
                                                 <div className="flex items-center gap-2">
                                                        ENTRAR AL SISTEMA <ArrowRight className="w-5 h-5" />
                                                 </div>
                                          )}
                                   </Button>

                                   <p className="text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] pt-4">
                                          Solo personal autorizado
                                   </p>
                            </form>
                     </div>

                     {/* Footer Info */}
                     <div className="mt-20 relative z-10 text-center opacity-20 hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-bold font-mono tracking-widest">SODERIA_NICO_OS_V2.0</p>
                     </div>
              </div>
       );
}
