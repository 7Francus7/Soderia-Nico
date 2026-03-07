import { prisma } from "@/lib/prisma";
import { Users, TrendingUp, AlertCircle, Search, Droplet } from "lucide-react";
import ClientList from "@/components/clients/ClientList";
import NewClientButton from "@/components/clients/NewClientButton";
import { MetricCard } from "@/components/dashboard/MetricCard";

export default async function ClientesPage({
       searchParams,
}: {
       searchParams: Promise<{ q?: string; sort?: string }>;
}) {
       const resolvedParams = await searchParams;
       const search = resolvedParams.q || "";
       const sort = resolvedParams.sort === "debt";

       const clients = await prisma.client.findMany({
              where: search ? {
                     OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { address: { contains: search, mode: 'insensitive' } },
                     ]
              } : {},
              orderBy: sort ? { balance: "desc" } : { name: "asc" },
       });

       const totalClients = await prisma.client.count();
       const totalDebt = await prisma.client.aggregate({ _sum: { balance: true } });
       const clientsWithDebt = await prisma.client.count({ where: { balance: { gt: 0 } } });

       return (
              <div className="flex flex-col min-h-screen">
                     {/* Page Header */}
                     <header className="page-container pb-8 pt-12">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                   <div className="space-y-1.5">
                                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                                 <Users className="w-4 h-4" />
                                                 <span className="text-[11px] font-bold uppercase tracking-[0.15em]">Gestión de Clientes</span>
                                          </div>
                                          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                                                 Directorio <span className="text-primary tracking-tighter">Comercial</span>
                                          </h1>
                                          <p className="text-muted-foreground font-medium">Administra la base de datos de consumidores y saldos.</p>
                                   </div>

                                   <NewClientButton />
                            </div>
                     </header>

                     <main className="page-container pt-0 pb-20 space-y-12">
                            {/* Key Metrics */}
                            <section>
                                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                          <MetricCard
                                                 label="CLIENTES ACTIVOS"
                                                 value={totalClients.toString()}
                                                 icon={<Users />}
                                                 description="Fichero maestro"
                                                 variant="blue"
                                          />
                                          <MetricCard
                                                 label="DEUDA GLOBAL"
                                                 value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                                 icon={<TrendingUp />}
                                                 description="Cartera a cobrar"
                                                 variant="rose"
                                          />
                                          <MetricCard
                                                 label="MOROSIDAD"
                                                 value={clientsWithDebt.toString()}
                                                 icon={<AlertCircle />}
                                                 description="Clientes con saldo"
                                                 variant="amber"
                                          />
                                   </div>
                            </section>

                            {/* Client List Section */}
                            <section className="space-y-6">
                                   <div className="flex items-center justify-between px-1">
                                          <div className="flex items-center gap-3">
                                                 <div className="p-2.5 bg-primary/10 rounded-xl">
                                                        <Search className="w-5 h-5 text-primary" />
                                                 </div>
                                                 <div className="flex flex-col">
                                                        <h3 className="text-xl font-bold tracking-tight">Cartera de Clientes</h3>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Visualización y Filtros</p>
                                                 </div>
                                          </div>
                                          <div className="px-4 py-1.5 bg-secondary border border-border rounded-full flex items-center gap-2">
                                                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{totalClients} ENTIDADES</span>
                                          </div>
                                   </div>

                                   <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                                          <ClientList initialClients={clients} />
                                   </div>
                            </section>
                     </main>

                     {/* Footer */}
                     <footer className="mt-auto border-t border-border bg-white py-10 px-16 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                   <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                                          <Droplet className="w-4 h-4 text-primary fill-current" />
                                   </div>
                                   <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Sodería Nico App v2.6.0</span>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground opacity-60">Google Professional Interface Upgrade</p>
                     </footer>
              </div>
       );
}
