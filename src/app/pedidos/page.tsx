"use strict";

import { prisma } from "@/lib/prisma";
import { ShoppingBag, Clock, Package, Zap, ArrowRight } from "lucide-react";
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
              <div className="page-container space-y-10 lg:space-y-16 text-white">

                     {/* HEADER */}
                     <header className="relative flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-8 border-b border-white/5">
                            <div className="absolute top-0 left-0 w-56 h-56 bg-primary/10 rounded-full blur-[80px] pointer-events-none opacity-25" />

                            <div className="space-y-4 relative z-10 flex-1 min-w-0">
                                   <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40">
                                          <ShoppingBag className="w-3 h-3 shrink-0" />
                                          <span className="text-[9px] font-black uppercase tracking-[0.25em]">Logística de Ventas</span>
                                   </div>
                                   <h1 className="text-hero font-black tracking-tighter italic uppercase leading-[0.85]">
                                          Gestión de<br /><span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Pedidos</span>.
                                   </h1>
                            </div>

                            <div className="relative z-10 shrink-0">
                                   <NewOrderButton />
                            </div>
                     </header>

                     {/* STATS */}
                     <div className="grid grid-cols-3 gap-3 sm:gap-5">
                            <StatCard
                                   label="Pendientes"
                                   value={stats.pending.toString()}
                                   icon={<Clock className="w-5 h-5 sm:w-7 sm:h-7" />}
                                   color="amber"
                                   description="Por despachar"
                            />
                            <StatCard
                                   label="Entregados"
                                   value={stats.delivered.toString()}
                                   icon={<Package className="w-5 h-5 sm:w-7 sm:h-7" />}
                                   color="emerald"
                                   description="Completado"
                            />
                            <StatCard
                                   label="Hoy"
                                   value={stats.totalToday.toString()}
                                   icon={<Zap className="w-5 h-5 sm:w-7 sm:h-7" />}
                                   color="primary"
                                   description="Acumulado"
                            />
                     </div>

                     {/* LIST */}
                     <section className="space-y-6">
                            <div className="flex items-center gap-4 px-1">
                                   <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 shrink-0">Pipeline de Operaciones</h3>
                                   <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
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

       return (
              <div className={cn(
                     "relative overflow-hidden p-4 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border transition-all duration-500 group",
                     colors[color] || colors.primary
              )}>
                     <div className="flex justify-between items-start mb-4 sm:mb-8">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-[1rem] sm:rounded-[1.5rem] bg-black/40 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                   {icon}
                            </div>
                            <ArrowRight className="w-4 h-4 hidden sm:block opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                     </div>
                     <div>
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1 truncate">{label}</p>
                            <h4 className="text-3xl sm:text-5xl font-black tracking-tighter tabular-nums mb-1">{value}</h4>
                            <p className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] opacity-20 hidden sm:block">{description}</p>
                     </div>
              </div>
       )
}
