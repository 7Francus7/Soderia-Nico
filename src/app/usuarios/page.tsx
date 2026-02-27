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
              <div className="space-y-12 animate-fade-in-up">
                     {/* Header */}
                     <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="space-y-2">
                                   <div className="flex items-center gap-3 mb-2">
                                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                 <ShieldCheck className="w-5 h-5" />
                                          </div>
                                          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
                                   </div>
                                   <p className="text-muted-foreground font-medium">
                                          Gestión de perfiles, roles jerárquicos y control de accesos al sistema.
                                   </p>
                            </div>
                            <NewUserButton />
                     </header>

                     {/* Stats Quick Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <UserStatCard label="Total Personal" value={users.length} icon={<Users className="w-4 h-4" />} />
                            <UserStatCard label="Choferes" value={users.filter((u: any) => u.role === "CHOFER").length} icon={<Truck className="w-4 h-4" />} color="blue" />
                            <UserStatCard label="Admin" value={users.filter((u: any) => u.role === "ADMIN").length} icon={<Lock className="w-4 h-4" />} color="amber" />
                            <UserStatCard label="Activos" value={users.filter((u: any) => u.isActive).length} icon={<ShieldCheck className="w-4 h-4" />} color="emerald" />
                     </div>

                     {/* Main List Area */}
                     <section className="pt-8 border-t border-border">
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
