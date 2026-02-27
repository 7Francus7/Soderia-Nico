"use strict";
"use client";

import { useState } from "react";
import { Plus, X, UserPlus, Shield, ShieldAlert, Loader2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createUser } from "@/actions/users";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NewUserButton() {
       const [isOpen, setIsOpen] = useState(false);
       const [loading, setLoading] = useState(false);
       const [formData, setFormData] = useState({
              username: "",
              password: "",
              fullName: "",
              role: "CHOFER" as "ADMIN" | "CHOFER" | "VENDEDOR"
       });

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              if (!formData.username || !formData.password) {
                     toast.error("Usuario y contraseña son obligatorios");
                     return;
              }

              setLoading(true);
              const result = await createUser(formData);
              if (result.success) {
                     toast.success("Usuario creado exitosamente");
                     setIsOpen(false);
                     setFormData({ username: "", password: "", fullName: "", role: "CHOFER" });
              } else {
                     toast.error("Error: " + result.error);
              }
              setLoading(false);
       };

       return (
              <>
                     <Button onClick={() => setIsOpen(true)} className="w-full md:w-auto px-8 h-14 rounded-2xl shadow-2xl bg-slate-900 group">
                            <UserPlus className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                            NUEVO USUARIO
                     </Button>

                     {isOpen && (
                            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                                   <div className="bg-card w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-in-up">

                                          <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5">
                                                 <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                                               <Shield className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-2xl font-black tracking-tight uppercase italic">Alta de Personal</h3>
                                                               <p className="text-sm text-muted-foreground font-medium italic opacity-60">Credenciales y privilegios.</p>
                                                        </div>
                                                 </div>
                                                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-2xl">
                                                        <X className="w-6 h-6" />
                                                 </Button>
                                          </div>

                                          <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                                 <div className="space-y-4">
                                                        <div className="space-y-2">
                                                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Nombre Completo</label>
                                                               <input
                                                                      type="text"
                                                                      value={formData.fullName}
                                                                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                                      className="w-full h-14 bg-muted/20 border border-white/5 rounded-2xl px-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-20"
                                                                      placeholder="Ej: Juan Pérez"
                                                               />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                               <div className="space-y-2">
                                                                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Usuario *</label>
                                                                      <input
                                                                             type="text"
                                                                             required
                                                                             value={formData.username}
                                                                             onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                                                                             className="w-full h-14 bg-muted/20 border border-white/5 rounded-2xl px-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-20 lowercase"
                                                                             placeholder="ej: juanp"
                                                                      />
                                                               </div>
                                                               <div className="space-y-2">
                                                                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Contraseña *</label>
                                                                      <div className="relative">
                                                                             <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                                                                             <input
                                                                                    type="password"
                                                                                    required
                                                                                    value={formData.password}
                                                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                                                    className="w-full h-14 bg-muted/20 border border-white/5 rounded-2xl pl-12 pr-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                                                    placeholder="••••••••"
                                                                             />
                                                                      </div>
                                                               </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Rol del Sistema</label>
                                                               <div className="grid grid-cols-3 gap-2 p-1 bg-muted/10 rounded-2xl border border-white/5">
                                                                      {["CHOFER", "ADMIN", "VENDEDOR"].map((role) => (
                                                                             <button
                                                                                    key={role}
                                                                                    type="button"
                                                                                    onClick={() => setFormData({ ...formData, role: role as any })}
                                                                                    className={cn(
                                                                                           "py-3 rounded-xl font-black text-[10px] uppercase transition-all",
                                                                                           formData.role === role ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-white/5"
                                                                                    )}
                                                                             >
                                                                                    {role}
                                                                             </button>
                                                                      ))}
                                                               </div>
                                                        </div>
                                                 </div>

                                                 <div className="flex gap-4 pt-4 border-t border-white/5">
                                                        <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsOpen(false)}>Cancelar</Button>
                                                        <Button type="submit" disabled={loading} className="flex-[2] h-16 rounded-2xl shadow-xl font-black text-sm uppercase tracking-widest">
                                                               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "CREAR USUARIO"}
                                                        </Button>
                                                 </div>
                                          </form>
                                   </div>
                            </div>
                     )}
              </>
       );
}
