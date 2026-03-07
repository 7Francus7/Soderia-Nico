"use strict";

import { prisma } from "@/lib/prisma";
import { ShoppingBag, Clock, Package, Zap, ArrowRight, TrendingUp, Calendar, Inbox } from "lucide-react";
import OrderList from "@/components/orders/OrderList";
import NewOrderButton from "@/components/orders/NewOrderButton";
import { cn } from "@/lib/utils";

export default async function PedidosPage() {
       const orders = await prisma.order.findMany({
              include: {
                     client: true,
                     items: {
                            include: { product: true }
                     }
              },
              orderBy: { createdAt: "desc" },
              take: 50
       });

       const stats = {
              pending: orders.filter((o: any) => o.status === "CONFIRMED").length,
              delivered: orders.filter((o: any) => o.status === "DELIVERED").length,
              totalToday: orders.filter((o: any) => {
                     const today = new Date();
                     today.setHours(0, 0, 0, 0);
                     return o.createdAt >= today;
              }).length
       };

       return (
              <div className="flex flex-col min-h-screen bg-white animate-fade-in pb-32">
                     {/* iOS PREMIUM HEADER */}
                     <header className="px-6 pt-12 pb-10 sm:px-10 lg:px-16 flex flex-col gap-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                                   <div className="space-y-1">
                                          <div className="flex items-center gap-1.5 opacity-40 mb-1 px-1">
                                                 <Inbox className="w-4 h-4" />
                                                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logística Activa</span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                                 <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground leading-tight">Pedidos</h1>
                                          </div>
                                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1 opacity-60">
                                                 Gestión de despachos y flujo de ventas
                                          </p>
                                   </div>
                                   <div className="w-full sm:w-auto">
                                          <NewOrderButton />
                                   </div>
                            </div>
                     </header>

                     <main className="px-6 sm:px-10 lg:px-16 space-y-12">
                            {/* STATS - 3 columns premium cards */}
                            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                   <MetricOrderCard
                                          label="Pendientes"
                                          value={stats.pending.toString()}
                                          icon={Clock}
                                          color="amber"
                                          subtitle="A la espera"
                                   />
                                   <MetricOrderCard
                                          label="Entregados"
                                          value={stats.delivered.toString()}
                                          icon={Package}
                                          color="emerald"
                                          subtitle="Completados"
                                   />
                                   <MetricOrderCard
                                          label="Pedidos de Hoy"
                                          value={stats.totalToday.toString()}
                                          icon={Zap}
                                          color="primary"
                                          subtitle="Ventas del día"
                                   />
                            </section>

                            {/* PIPELINE SECTION */}
                            <section className="pt-8 space-y-8">
                                   <div className="flex items-center justify-between px-2">
                                          <div className="flex items-center gap-3">
                                                 <TrendingUp className="w-4 h-4 text-primary opacity-40" />
                                                 <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.15em]">Pipeline de Operaciones</h3>
                                          </div>
                                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{orders.length} Totales</span>
                                   </div>
                                   <OrderList initialOrders={orders} />
                            </section>
                     </main>
              </div>
       );
}

function MetricOrderCard({ label, value, icon: Icon, color, subtitle }: { label: string, value: string, icon: any, color: "primary" | "amber" | "emerald", subtitle: string }) {
       const colors = {
              primary: "bg-primary/5 text-primary border-primary/10 shadow-primary/5",
              amber: "bg-amber-50 text-amber-500 border-amber-100 shadow-amber-500/5",
              emerald: "bg-emerald-50 text-emerald-500 border-emerald-100 shadow-emerald-500/5"
       };

       return (
              <div className="group p-10 rounded-[2.5rem] border-2 border-slate-50 bg-white flex flex-col transition-all duration-300 shadow-2xl shadow-slate-200/40 hover:scale-[1.02] hover:shadow-slate-300/40">
                     <div className="flex justify-between items-start mb-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-300">{label}</p>
                            <div className={cn(
                                   "w-14 h-14 rounded-[1.4rem] flex items-center justify-center transition-transform group-hover:rotate-12",
                                   colors[color]
                            )}>
                                   <Icon className="w-7 h-7 stroke-[2.5px]" />
                            </div>
                     </div>
                     <div>
                            <h3 className="text-5xl font-black tracking-tighter tabular-nums leading-none text-foreground mb-4">
                                   {value}
                            </h3>
                            <div className="flex items-center gap-2">
                                   <div className={cn("w-1.5 h-1.5 rounded-full", color === "amber" ? "bg-amber-400 animate-pulse" : color === "emerald" ? "bg-emerald-400" : "bg-primary")} />
                                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">{subtitle}</p>
                            </div>
                     </div>
              </div>
       )
}
