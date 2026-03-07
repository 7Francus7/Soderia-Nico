"use strict";

import { Truck, Users, CreditCard, Banknote, Activity, Calendar, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import NewOrderButton from "@/components/orders/NewOrderButton";
import LiveActivityMonitor from "@/components/dashboard/LiveActivityMonitor";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";

export default async function Home() {
       const session = await getServerSession();
       const [clientCount, orderCount, totalDebt, activeDeliveries] = await Promise.all([
              prisma.client.count(),
              prisma.order.count({ where: { status: "DELIVERED" } }),
              prisma.client.aggregate({ _sum: { balance: true } }),
              prisma.delivery.count({ where: { status: "IN_PROGRESS" } })
       ]);

       const currentDate = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

       return (
              <div className="page-container space-y-10 lg:space-y-16 text-white selection:bg-white selection:text-black">

                     {/* HERO SECTION */}
                     <header className="relative flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-8 border-b border-white/5">
                            <div className="absolute -top-16 -left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none opacity-40" />

                            <div className="space-y-4 relative z-10 flex-1 min-w-0">
                                   {/* Badge */}
                                   <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                                          <Zap className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                                          <span className="text-[9px] font-black uppercase tracking-[0.25em] truncate">Sistema v2.5.0 Premium</span>
                                          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                   </div>

                                   {/* Title */}
                                   <div>
                                          <h2 className="text-hero font-black tracking-tighter leading-[0.85] italic uppercase">
                                                 Sodería<br /><span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Nico</span>.
                                          </h2>
                                   </div>

                                   {/* Meta pills */}
                                   <div className="flex flex-wrap items-center gap-3">
                                          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 font-black text-[10px] uppercase tracking-widest text-white/40">
                                                 <Calendar className="w-3 h-3 shrink-0" />
                                                 <span className="truncate max-w-[160px] sm:max-w-none">{currentDate}</span>
                                          </div>
                                          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 font-black text-[10px] uppercase tracking-widest text-emerald-500">
                                                 <Activity className="w-3 h-3 animate-pulse shrink-0" />
                                                 {activeDeliveries} Rutas Activas
                                          </div>
                                   </div>
                            </div>

                            <div className="relative z-10 shrink-0">
                                   <NewOrderButton />
                            </div>
                     </header>

                     {/* METRICS */}
                     <section className="space-y-6">
                            <div className="flex items-center gap-4 px-1">
                                   <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 shrink-0">Métricas Hoy</h3>
                                   <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                                   <MetricCard
                                          label="Clientes"
                                          value={clientCount.toString()}
                                          icon={<Users className="w-5 h-5 sm:w-7 sm:h-7" />}
                                          color="blue"
                                          href="/clientes"
                                   />
                                   <MetricCard
                                          label="Entregas"
                                          value={orderCount.toString()}
                                          icon={<Truck className="w-5 h-5 sm:w-7 sm:h-7" />}
                                          color="purple"
                                          href="/pedidos"
                                   />
                                   <MetricCard
                                          label="Crédito"
                                          value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                          icon={<CreditCard className="w-5 h-5 sm:w-7 sm:h-7" />}
                                          color="rose"
                                          href="/cuentas"
                                   />
                                   <MetricCard
                                          label="En Ruta"
                                          value={activeDeliveries.toString()}
                                          icon={<Activity className="w-5 h-5 sm:w-7 sm:h-7" />}
                                          color="amber"
                                          href="/repartos"
                                   />
                            </div>
                     </section>

                     {/* STRATEGIC CONTENT */}
                     <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">

                            {/* Analytics Chart */}
                            <div className="xl:col-span-8 space-y-6">
                                   <div className="px-1">
                                          <h4 className="text-section font-black tracking-tighter italic uppercase text-white">Análisis Operativo</h4>
                                          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 mt-1">Rendimiento y ventas semanales</p>
                                   </div>
                                   <div className="p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[3rem] bg-neutral-900/30 border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                                          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                          <AnalyticsDashboard />
                                   </div>
                            </div>

                            {/* Command Center + Live Monitor */}
                            <div className="xl:col-span-4 space-y-8">
                                   {/* Quick Actions */}
                                   <div className="space-y-5">
                                          <div className="px-1">
                                                 <h4 className="text-lg sm:text-xl font-black tracking-tighter italic uppercase text-white">Centro de Comando</h4>
                                                 <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20 mt-1">Acceso a módulos</p>
                                          </div>
                                          <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
                                                 <QuickActionCard
                                                        title="Repartos"
                                                        subtitle="Rutas y Logística"
                                                        icon={<Truck className="w-5 h-5" />}
                                                        href="/repartos"
                                                        color="blue"
                                                 />
                                                 <QuickActionCard
                                                        title="Clientes"
                                                        subtitle="Fichas y Saldos"
                                                        icon={<Users className="w-5 h-5" />}
                                                        href="/clientes"
                                                        color="sky"
                                                 />
                                                 <QuickActionCard
                                                        title="Cuentas"
                                                        subtitle="Cobranzas"
                                                        icon={<CreditCard className="w-5 h-5" />}
                                                        href="/cuentas"
                                                        color="rose"
                                                 />
                                                 <QuickActionCard
                                                        title="Caja"
                                                        subtitle="Financiero"
                                                        icon={<Banknote className="w-5 h-5" />}
                                                        href="/caja"
                                                        color="emerald"
                                                 />
                                          </div>
                                   </div>

                                   {/* Live Monitor */}
                                   <div className="space-y-5">
                                          <div className="px-1 flex justify-between items-end">
                                                 <div>
                                                        <h4 className="text-lg font-black tracking-tighter italic uppercase text-white">Live Monitor</h4>
                                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20 mt-1">Actividad reciente</p>
                                                 </div>
                                                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                          </div>
                                          <div className="p-5 sm:p-8 rounded-[2rem] bg-black/40 border border-white/5 backdrop-blur-md">
                                                 <LiveActivityMonitor />
                                          </div>
                                   </div>
                            </div>
                     </div>

                     {/* FOOTER */}
                     <footer className="pt-10 pb-2 flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-white/10 border-t border-white/5">
                            <div>© 2026 Sodería Nico</div>
                            <div className="flex gap-6">
                                   <span>Status: Optimal</span>
                                   <span>Security: Active</span>
                            </div>
                     </footer>
              </div>
       );
}
