"use strict";
"use client";

import { useState } from "react";
import { Search, User, Trash2, Shield, ShieldAlert, CheckCircle, XCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { deleteUser, updateUser } from "@/actions/users";
import { toast } from "sonner";

export default function UserList({ initialUsers }: { initialUsers: any[] }) {
       const [search, setSearch] = useState("");

       const filtered = initialUsers.filter(u =>
              u.username.toLowerCase().includes(search.toLowerCase()) ||
              (u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase()))
       );

       const handleDelete = async (id: number) => {
              if (!confirm("¿Deseas eliminar este usuario?")) return;
              const result = await deleteUser(id);
              if (result.success) toast.success("Usuario eliminado");
              else toast.error("Error: " + result.error);
       };

       const toggleStatus = async (user: any) => {
              const result = await updateUser(user.id, { isActive: !user.isActive });
              if (result.success) toast.success("Estado actualizado");
              else toast.error("Error al actualizar");
       };

       return (
              <div className="space-y-8">
                     {/* Search */}
                     <div className="relative group max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                   type="text"
                                   placeholder="Buscar usuarios..."
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                                   className="w-full bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl h-14 pl-12 pr-4 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xl"
                            />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.length === 0 ? (
                                   <div className="col-span-full py-20 text-center bg-card/40 border border-white/10 rounded-[2.5rem] glass-card opacity-50">
                                          No se encontraron usuarios.
                                   </div>
                            ) : (
                                   filtered.map((user, idx) => (
                                          <Card
                                                 key={user.id}
                                                 className="group overflow-hidden rounded-[3rem] border border-white/5 bg-card hover:border-primary/20 transition-all hover:scale-[1.02] animate-fade-in-up shadow-2xl shadow-black/5"
                                                 style={{ animationDelay: `${idx * 0.05}s` }}
                                          >
                                                 <div className="p-8">
                                                        <div className="flex justify-between items-start mb-6">
                                                               <div className="w-16 h-16 bg-muted/20 rounded-[1.5rem] flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all duration-500">
                                                                      <User className="w-8 h-8" />
                                                               </div>
                                                               <div className={cn(
                                                                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                                      user.role === "ADMIN" ? "bg-amber-500/20 text-amber-500" : "bg-primary/20 text-primary"
                                                               )}>
                                                                      {user.role}
                                                               </div>
                                                        </div>

                                                        <div className="space-y-1 mb-6">
                                                               <h3 className="text-2xl font-black tracking-tight pt-2 truncate">{user.fullName || user.username}</h3>
                                                               <p className="text-sm font-medium text-muted-foreground italic opacity-60">@{user.username}</p>
                                                        </div>

                                                        <div className="flex items-center gap-4 pt-1">
                                                               <div className={cn(
                                                                      "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                                                                      user.isActive ? "text-emerald-500" : "text-rose-500"
                                                               )}>
                                                                      {user.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                                      {user.isActive ? "Activo" : "Suspendido"}
                                                               </div>
                                                        </div>
                                                 </div>

                                                 <div className="px-8 pb-8 flex items-center justify-between">
                                                        <Button
                                                               variant="ghost"
                                                               onClick={() => toggleStatus(user)}
                                                               className={cn(
                                                                      "text-[10px] font-black tracking-widest uppercase px-4 h-10 rounded-xl border border-white/10",
                                                                      user.isActive ? "hover:bg-rose-500/10 hover:text-rose-500" : "hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20"
                                                               )}
                                                        >
                                                               {user.isActive ? "SUSPENDER" : "ACTIVAR"}
                                                        </Button>

                                                        <div className="flex gap-2">
                                                               <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5 opacity-40 hover:opacity-100">
                                                                      <Shield className="w-5 h-5" />
                                                               </Button>
                                                               <Button
                                                                      variant="ghost"
                                                                      size="icon"
                                                                      onClick={() => handleDelete(user.id)}
                                                                      className="h-10 w-10 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 opacity-40 hover:opacity-100"
                                                               >
                                                                      <Trash2 className="w-5 h-5" />
                                                               </Button>
                                                        </div>
                                                 </div>
                                          </Card>
                                   ))
                            )}
                     </div>
              </div>
       );
}
