"use strict";

import { prisma } from "@/lib/prisma";
import { Users, TrendingUp, AlertCircle, ArrowUpRight, Search, Activity } from "lucide-react";
import ClientList from "@/components/clients/ClientList";
import NewClientButton from "@/components/clients/NewClientButton";
import { cn } from "@/lib/utils";

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
              <div className="max-w-screen-2xl mx-auto space-y-24 py-12 px-6 sm:px-10 text-white animate-fade-in-up selection:bg-white selection:text-black">

                     {/* RADICAL HEADER */}
                     <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16 border-b border-white/5">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none opacity-30" />

                            <div className="space-y-6 relative z-10">
                                   <div className="inline-flex items-center gap-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40">
                                          <Users className="w-4 h-4" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Gestión de Cartera de Clientes</span>
                                   </div>
                                   <div className="space-y-4">
                                          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-[0.85]">
                                                 Panel de<br /><span className="text-transparent border-text-white" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Clientes</span>.
                                          </h1>
                                          <p className="max-w-xl text-white/30 font-black uppercase tracking-[0.2em] text-[10px] leading-relaxed">
                                                 Administración central de cuentas corrientes, historial de envases y perfiles de consumo para logística optimizada.
                                          </p>
                                   </div>
                            </div>
                            <div className="relative z-10">
                                   <NewClientButton />
                            </div>
                     </header>

                     {/* PERFORMANCE STATS */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <StatLarge
                                   label="Total Clientes"
                                   value={totalClients.toString()}
                                   icon={<Users className="w-7 h-7" />}
                                   color="blue"
                                   description="Base de datos activa"
                            />
                            <StatLarge
                                   label="Deuda Global"
                                   value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                   icon={<TrendingUp className="w-7 h-7" />}
                                   color="rose"
                                   description="Total a cobrar"
                            />
                            <StatLarge
                                   label="Segmento en Deuda"
                                   value={clientsWithDebt.toString()}
                                   icon={<AlertCircle className="w-7 h-7" />}
                                   color="amber"
                                   description="Revisiones pendientes"
                            />
                     </div>

                     {/* COMMAND CENTER LIST */}
                     <section className="space-y-12">
                            <div className="flex items-center justify-between px-2">
                                   <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Directorio de Clientes / Saldos</h3>
                                   <div className="h-[1px] flex-1 mx-10 bg-gradient-to-r from-white/10 to-transparent" />
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
       const colorClass = colors[color] || colors.blue;

       return (
              <div className={cn(
                     "relative overflow-hidden p-10 rounded-[3rem] border transition-all duration-500 group",
                     colorClass
              )}>
                     <div className="flex justify-between items-start mb-10">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-black/40 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                                   {icon}
                            </div>
                            <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                     </div>
                     <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2 truncate">{label}</p>
                            <h4 className="text-6xl font-black tracking-tighter tabular-nums mb-4">{value}</h4>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-20">{description}</p>
                     </div>
              </div>
       )
}
