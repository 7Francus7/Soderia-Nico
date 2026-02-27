import { prisma } from "@/lib/prisma";
import { ShieldCheck, UserPlus, Search, User, Key, Trash2, Mail, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import UserList from "@/components/UserList";
import NewUserButton from "@/components/NewUserButton";

export default async function UsuariosPage() {
       const users = await prisma.user.findMany({
              orderBy: { createdAt: "desc" }
       });

       return (
              <div className="min-h-screen bg-background p-6 lg:p-10 pb-32">
                     <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[40vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                     <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                   <div className="space-y-1">
                                          <div className="flex items-center gap-3">
                                                 <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/10">
                                                        <ShieldCheck className="w-6 h-6" />
                                                 </div>
                                                 <h1 className="text-4xl font-black tracking-tight uppercase italic">Usuarios</h1>
                                          </div>
                                          <p className="text-muted-foreground font-medium text-lg">
                                                 Administración de personal y permisos de acceso.
                                          </p>
                                   </div>

                                   <NewUserButton />
                            </div>

                            {/* User Summary Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                   <Card className="bg-card/40 border-white/5 p-6 rounded-3xl">
                                          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Total Personal</p>
                                          <h3 className="text-3xl font-black italic">{users.length}</h3>
                                   </Card>
                                   <Card className="bg-emerald-500/5 border-emerald-500/10 p-6 rounded-3xl">
                                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 mb-1">Activos</p>
                                          <h3 className="text-3xl font-black text-emerald-500">{users.filter((u: any) => u.isActive).length}</h3>
                                   </Card>
                                   <Card className="bg-primary/5 border-primary/10 p-6 rounded-3xl">
                                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">Choferes</p>
                                          <h3 className="text-3xl font-black text-primary">{users.filter((u: any) => u.role === "CHOFER").length}</h3>
                                   </Card>
                                   <Card className="bg-amber-500/5 border-amber-500/10 p-6 rounded-3xl">
                                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/60 mb-1">Administradores</p>
                                          <h3 className="text-3xl font-black text-amber-500">{users.filter((u: any) => u.role === "ADMIN").length}</h3>
                                   </Card>
                            </div>

                            {/* List Section */}
                            <UserList initialUsers={users} />
                     </div>
              </div>
       );
}
