"use strict";

import { prisma } from "@/lib/prisma";
import { ShoppingBag, Clock, Package, Calendar, ArrowRight, Activity, Zap } from "lucide-react";
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
              <div className="max-w-screen-2xl mx-auto space-y-20 py-12 px-6 sm:px-10 text-white animate-fade-in-up">

                     {/* RADICAL HEADER */}
                     <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16 border-b border-white/5">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none opacity-30" />

                            <div className="space-y-6 relative z-10">
                                   <div className="inline-flex items-center gap-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40">
                                          <ShoppingBag className="w-4 h-4" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Logística de Ventas</span>
                                   </div>
                                   <div className="space-y-4">
                                          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-[0.85]">
                                                 Gestión de<br /><span className="text-transparent border-text-white" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Pedidos</span>.
                                          </h1>
                                          <p className="max-w-xl text-white/30 font-black uppercase tracking-[0.2em] text-[10px] leading-relaxed">
                                                 Monitoreo en tiempo real de la cadena de suministro, entregas finales y facturación automatizada por ruta.
                                          </p>
                                   </div>
                            </div>
                            <div className="relative z-10">
                                   <NewOrderButton />
                            </div>
                     </header>

                     {/* PERFORMANCE STATS */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <StatCard
                                   label="Órdenes Pendientes"
                                   value={stats.pending.toString()}
                                   icon={<Clock className="w-7 h-7" />}
                                   color="amber"
                                   description="Esperando despacho"
                            />
                            <StatCard
                                   label="Entregas Exitosas"
                                   value={stats.delivered.toString()}
                                   icon={<Package className="w-7 h-7" />}
                                   color="emerald"
                                   description="Ciclo completado"
                            />
                            <StatCard
                                   label="Actividad de Hoy"
                                   value={stats.totalToday.toString()}
                                   icon={<Zap className="w-7 h-7" />}
                                   color="primary"
                                   description="Volumen acumulado"
                            />
                     </div>

                     {/* ORDERS PIPELINE SECTION */}
                     <section className="space-y-12">
                            <div className="flex items-center justify-between px-2">
                                   <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Historial de Operaciones / Pipeline</h3>
                                   <div className="h-[1px] flex-1 mx-10 bg-gradient-to-r from-white/10 to-transparent" />
                            </div>
                            <OrderList initialOrders={orders} />
                     </section>
              </div>
       );
}

function StatCard({ label, value, icon, color, description }: any) {
       const colors: any = {
              amber: "border-amber-500/10 bg-amber-500/5 text-amber-500",
              emerald: "border-emerald-500/10 bg-emerald-500/5 text-emerald-500",
              primary: "border-white/10 bg-white/5 text-white"
       }
       const colorClass = colors[color] || colors.primary;

       return (
              <div className={cn(
                     "relative overflow-hidden p-10 rounded-[3rem] border transition-all duration-500 group",
                     colorClass
              )}>
                     <div className="flex justify-between items-start mb-10">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-black/40 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                                   {icon}
                            </div>
                            <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                     </div>
                     <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2 truncate">{label}</p>
                            <h4 className="text-6xl font-black tracking-tighter tabular-nums mb-4">{value}</h4>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-20">{description}</p>
                     </div>
                     <div className="absolute top-0 right-0 p-8 opacity-5">
                            {icon}
                     </div>
              </div>
       )
}
