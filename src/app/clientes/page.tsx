import { prisma } from "@/lib/prisma";
import { Users, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ClientList from "@/components/clients/ClientList";
import NewClientButton from "@/components/clients/NewClientButton";

export default async function ClientesPage({
       searchParams,
}: {
       searchParams: { q?: string; sort?: string };
}) {
       const search = searchParams.q || "";
       const sort = searchParams.sort === "debt";

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
              <div className="space-y-12 animate-fade-in-up">
                     {/* Header */}
                     <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="space-y-2">
                                   <div className="flex items-center gap-3 mb-2">
                                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                 <Users className="w-5 h-5" />
                                          </div>
                                          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                                   </div>
                                   <p className="text-muted-foreground font-medium">
                                          Administración central de cartera, cuentas corrientes y envases.
                                   </p>
                            </div>
                            <NewClientButton />
                     </header>

                     {/* Stats Bar */}
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <StatSmall label="Total Clientes" value={totalClients.toString()} icon={<Users className="w-4 h-4" />} />
                            <StatSmall label="Deuda Total" value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`} icon={<TrendingUp className="w-4 h-4" />} color="rose" />
                            <StatSmall label="En Deuda" value={clientsWithDebt.toString()} icon={<AlertCircle className="w-4 h-4" />} color="amber" />
                     </div>

                     {/* Main List */}
                     <section className="pt-8 border-t border-border">
                            <ClientList initialClients={clients} />
                     </section>
              </div>
       );
}

function StatSmall({ label, value, icon, color }: any) {
       const colors: any = {
              rose: "text-rose-600 dark:text-rose-400 bg-rose-500/5 border-rose-500/10",
              amber: "text-amber-600 dark:text-amber-400 bg-amber-500/5 border-amber-500/10",
              default: "text-primary bg-primary/5 border-primary/10"
       }
       const colorClass = colors[color] || colors.default;

       return (
              <Card className="bg-card border-border shadow-sm flex items-center p-6 gap-4 rounded-2xl">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass} border`}>
                            {icon}
                     </div>
                     <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                            <h4 className="text-2xl font-bold tracking-tight">{value}</h4>
                     </div>
              </Card>
       )
}
