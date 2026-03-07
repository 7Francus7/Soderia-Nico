"use strict";

import { prisma } from "@/lib/prisma";
import { ShoppingBag, Clock, Package, Zap, TrendingUp, Inbox } from "lucide-react";
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
              <div className="flex flex-col min-h-screen bg-background text-foreground animate-fade-in pb-32">

                     {/* GOOGLE PROFESSIONAL HEADER AREA */}
                     <header className="px-6 pt-12 pb-10 sm:px-10 lg:px-16">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                   <div className="space-y-2">
                                          <div className="flex items-center gap-2 mb-1">
                                                 <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20 shrink-0">
                                                        <ShoppingBag className="w-4 h-4" />
                                                 </div>
                                                 <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Logística Activa</span>
                                          </div>
                                          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                                                 Gestión de Pedidos
                                          </h1>
                                          <p className="text-sm font-medium text-muted-foreground max-w-2xl">
                                                 Monitorea el flujo de ventas, despachos y estado de entregas en tiempo real.
                                          </p>
                                   </div>

                                   <div className="w-full sm:w-auto">
                                          <NewOrderButton />
                                   </div>
                            </div>
                     </header>

                     <main className="px-6 sm:px-10 lg:px-16 space-y-12">
                            {/* STATS AREA */}
                            <section className="space-y-6">
                                   <div className="flex items-center gap-2 px-1">
                                          <div className="w-2 h-2 rounded-full bg-primary" />
                                          <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">Métricas de Operación</h3>
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                          <MetricOrderCard
                                                 label="Pendientes"
                                                 value={stats.pending.toString()}
                                                 icon={Clock}
                                                 color="amber"
                                                 subtitle="A la espera de entrega"
                                          />
                                          <MetricOrderCard
                                                 label="Entregados"
                                                 value={stats.delivered.toString()}
                                                 icon={Package}
                                                 color="emerald"
                                                 subtitle="Completados con éxito"
                                          />
                                          <MetricOrderCard
                                                 label="Pedidos de Hoy"
                                                 value={stats.totalToday.toString()}
                                                 icon={Zap}
                                                 color="blue"
                                                 subtitle="Ventas registradas hoy"
                                          />
                                   </div>
                            </section>

                            {/* LIST SECTION */}
                            <section className="space-y-6">
                                   <div className="flex items-center justify-between px-1">
                                          <div className="flex items-center gap-3">
                                                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                                        <TrendingUp className="w-5 h-5 stroke-[2px]" />
                                                 </div>
                                                 <div className="flex flex-col">
                                                        <h3 className="text-xl font-bold text-foreground tracking-tight">Pipeline de Operaciones</h3>
                                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Historial Reciente</p>
                                                 </div>
                                          </div>
                                          <div className="px-4 py-1.5 bg-secondary border border-border rounded-full flex items-center gap-2 shadow-sm">
                                                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{orders.length} TOTALES</span>
                                          </div>
                                   </div>

                                   <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                          <OrderList initialOrders={orders} />
                                   </div>
                            </section>
                     </main>
              </div>
       );
}

function MetricOrderCard({ label, value, icon: Icon, color, subtitle }: { label: string, value: string, icon: any, color: "blue" | "amber" | "emerald", subtitle: string }) {
       const colors = {
              blue: "text-blue-500 bg-blue-50 border-blue-100",
              amber: "text-amber-500 bg-amber-50 border-amber-100",
              emerald: "text-emerald-500 bg-emerald-50 border-emerald-100"
       };

       return (
              <div className="relative p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col gap-4 overflow-hidden">
                     <div className="flex justify-between items-start">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-300 shadow-sm", colors[color])}>
                                   <Icon className="w-6 h-6 stroke-[2px]" />
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </div>
                     </div>

                     <div className="relative z-10 px-0.5">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                            <h4 className="text-4xl font-bold tracking-tight text-foreground tabular-nums leading-none">{value}</h4>
                            <div className="flex items-center gap-1.5 mt-3">
                                   <div className={cn("w-1.5 h-1.5 rounded-full", color === "amber" ? "bg-amber-400 animate-pulse" : color === "emerald" ? "bg-emerald-500" : "bg-primary")} />
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{subtitle}</span>
                            </div>
                     </div>
              </div>
       )
}
