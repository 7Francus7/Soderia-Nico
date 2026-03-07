"use strict";

import { prisma } from "@/lib/prisma";
import { Users, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react";
import ClientList from "@/components/clients/ClientList";
import NewClientButton from "@/components/clients/NewClientButton";
import { cn } from "@/lib/utils";

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
              <div className="page-container space-y-10 lg:space-y-16 text-white selection:bg-white selection:text-black">

                     {/* HEADER */}
                     <header className="relative flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-8 border-b border-white/5">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none opacity-30" />

                            <div className="space-y-4 relative z-10 flex-1 min-w-0">
                                   <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40">
                                          <Users className="w-3 h-3 shrink-0" />
                                          <span className="text-[9px] font-black uppercase tracking-[0.25em]">Gestión de Clientes</span>
                                   </div>
                                   <div>
                                          <h1 className="text-hero font-black tracking-tighter italic uppercase leading-[0.85]">
                                                 Panel de<br /><span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Clientes</span>.
                                          </h1>
                                   </div>
                            </div>

                            <div className="relative z-10 shrink-0">
                                   <NewClientButton />
                            </div>
                     </header>

                     {/* STATS */}
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <StatLarge
                                   label="Total Clientes"
                                   value={totalClients.toString()}
                                   icon={<Users className="w-6 h-6 sm:w-7 sm:h-7" />}
                                   color="blue"
                                   description="Base de datos activa"
                            />
                            <StatLarge
                                   label="Deuda Global"
                                   value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                   icon={<TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />}
                                   color="rose"
                                   description="Total a cobrar"
                            />
                            <StatLarge
                                   label="Con Deuda"
                                   value={clientsWithDebt.toString()}
                                   icon={<AlertCircle className="w-6 h-6 sm:w-7 sm:h-7" />}
                                   color="amber"
                                   description="Revisiones pendientes"
                            />
                     </div>

                     {/* LIST */}
                     <section className="space-y-8">
                            <div className="flex items-center gap-4 px-1">
                                   <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 shrink-0">Directorio / Saldos</h3>
                                   <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                            </div>
                            <ClientList initialClients={clients} />
                     </section>
              </div>
       );
}

function StatLarge({ label, value, icon, color, description }: any) {
       const colors: any = {
              blue: "border-blue-500/10 bg-blue-500/5 text-blue-500",
              rose: "border-rose-500/10 bg-rose-500/5 text-rose-500",
              amber: "border-amber-500/10 bg-amber-500/5 text-amber-500",
       }

       return (
              <div className={cn(
                     "relative overflow-hidden p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border transition-all duration-500 group",
                     colors[color] || colors.blue
              )}>
                     <div className="flex justify-between items-start mb-6 sm:mb-10">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[1.25rem] sm:rounded-[1.5rem] bg-black/40 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                                   {icon}
                            </div>
                            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                     </div>
                     <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.35em] opacity-40 mb-1 truncate">{label}</p>
                            <h4 className="text-4xl sm:text-5xl font-black tracking-tighter tabular-nums mb-2">{value}</h4>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-20">{description}</p>
                     </div>
              </div>
       )
}
