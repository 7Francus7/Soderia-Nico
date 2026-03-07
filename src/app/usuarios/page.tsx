import { prisma } from "@/lib/prisma";
import { ShieldCheck, Users, Truck, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import UserList from "@/components/users/UserList";
import NewUserButton from "@/components/users/NewUserButton";

export default async function UsuariosPage() {
       const users = await prisma.user.findMany({
              orderBy: { createdAt: "desc" }
       });

       return (
              <div className="page-container space-y-8 lg:space-y-12 text-white">
                     {/* Header */}
                     <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 pb-6 border-b border-white/5">
                            <div className="space-y-2">
                                   <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                 <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                                          </div>
                                          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Usuarios</h1>
                                   </div>
                                   <p className="text-sm text-muted-foreground">
                                          Gestión de perfiles, roles y control de accesos.
                                   </p>
                            </div>
                            <NewUserButton />
                     </header>

                     {/* Stats Quick Grid - 2x2 on mobile */}
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                            <UserStatCard label="Total" value={users.length} icon={<Users className="w-4 h-4" />} />
                            <UserStatCard label="Choferes" value={users.filter((u: any) => u.role === "CHOFER").length} icon={<Truck className="w-4 h-4" />} color="blue" />
                            <UserStatCard label="Admin" value={users.filter((u: any) => u.role === "ADMIN").length} icon={<Lock className="w-4 h-4" />} color="amber" />
                            <UserStatCard label="Activos" value={users.filter((u: any) => u.isActive).length} icon={<ShieldCheck className="w-4 h-4" />} color="emerald" />
                     </div>

                     {/* Main List Area */}
                     <section className="pt-6 border-t border-white/5">
                            <UserList initialUsers={users} />
                     </section>
              </div>
       );
}

function UserStatCard({ label, value, icon, color }: any) {
       const colors: any = {
              blue: "text-blue-600 bg-blue-500/5 border-blue-500/10",
              amber: "text-amber-600 bg-amber-500/5 border-amber-500/10",
              emerald: "text-emerald-600 bg-emerald-500/5 border-emerald-500/10",
              default: "text-primary bg-primary/5 border-primary/10"
       }
       const colorClass = colors[color] || colors.default;

       return (
              <Card className="p-6 border-border bg-card shadow-sm rounded-2xl flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass} border`}>
                            {icon}
                     </div>
                     <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
                            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
                     </div>
              </Card>
       )
}
