"use strict";

import { Truck, Users, CreditCard, Banknote, Activity, Calendar, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import NewOrderButton from "@/components/orders/NewOrderButton";
import LiveActivityMonitor from "@/components/dashboard/LiveActivityMonitor";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { cn } from "@/lib/utils";

export default async function Home() {
       const session = await getServerSession();
       const [clientCount, orderCount, totalDebt, activeDeliveries] = await Promise.all([
              prisma.client.count(),
              prisma.order.count({ where: { status: "DELIVERED" } }),
              prisma.client.aggregate({ _sum: { balance: true } }),
              prisma.delivery.count({ where: { status: "IN_PROGRESS" } })
       ]);

       const userName = session?.user?.name || "Nico";
       const currentDate = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

       return (
              <div className="max-w-screen-2xl mx-auto space-y-24 py-12 px-6 sm:px-10 text-white selection:bg-white selection:text-black">

                     {/* RADICAL HERO SECTION */}
                     <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16 border-b border-white/5">
                            {/* Background decoration */}
                            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

                            <div className="space-y-8 relative z-10">
                                   <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 backdrop-blur-md">
                                          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sistema Operativo v2.5.0 Premium</span>
                                          <div className="w-1 h-1 rounded-full bg-white/20" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Live Status</span>
                                   </div>

                                   <div className="space-y-4">
                                          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] italic uppercase">
                                                 Sodería<br /><span className="text-transparent border-text-white stroke-white" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Nico</span>.
                                          </h2>
                                          <div className="flex flex-wrap items-center gap-6 mt-6">
                                                 <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5 font-black text-xs uppercase tracking-widest text-white/40">
                                                        <Calendar className="w-4 h-4" />
                                                        {currentDate}
                                                 </div>
                                                 <div className="flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 font-black text-xs uppercase tracking-widest text-emerald-500">
                                                        <Activity className="w-4 h-4 animate-pulse" />
                                                        {activeDeliveries} Rutas Activas
                                                 </div>
                                          </div>
                                   </div>
                            </div>

                            <div className="flex items-center gap-6 relative z-10">
                                   <NewOrderButton />
                            </div>
                     </header>

                     {/* MAIN METRICS HUB */}
                     <section className="space-y-12">
                            <div className="flex items-center justify-between px-2">
                                   <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Estado Global / Métricas Hoy</h3>
                                   <div className="h-[1px] flex-1 mx-10 bg-gradient-to-r from-white/10 to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                   <MetricCard
                                          label="Total Clientes"
                                          value={clientCount.toString()}
                                          icon={<Users className="w-7 h-7" />}
                                          color="blue"
                                          href="/clientes"
                                   />
                                   <MetricCard
                                          label="Ventas Entregadas"
                                          value={orderCount.toString()}
                                          icon={<Truck className="w-7 h-7" />}
                                          color="purple"
                                          href="/pedidos"
                                   />
                                   <MetricCard
                                          label="Crédito a Cobrar"
                                          value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                          icon={<CreditCard className="w-7 h-7" />}
                                          color="rose"
                                          href="/cuentas"
                                   />
                                   <MetricCard
                                          label="Repartos en Curso"
                                          value={activeDeliveries.toString()}
                                          icon={<Activity className="w-7 h-7" />}
                                          color="amber"
                                          href="/repartos"
                                   />
                            </div>
                     </section>

                     {/* STRATEGIC COMMAND CENTER */}
                     <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 pt-12">

                            {/* Left Side: Performance Analysis */}
                            <div className="xl:col-span-8 space-y-12">
                                   <div className="space-y-2 px-2">
                                          <h4 className="text-4xl font-black tracking-tighter italic uppercase text-white">Análisis Operativo</h4>
                                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Monitoreo de rendimiento y ventas semanales</p>
                                   </div>
                                   <div className="p-10 rounded-[4rem] bg-neutral-900/30 border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                                          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                          <AnalyticsDashboard />
                                   </div>
                            </div>

                            {/* Right Side: Activity & Quick Actions */}
                            <div className="xl:col-span-4 space-y-16">
                                   <div className="space-y-8">
                                          <div className="space-y-2 px-2">
                                                 <h4 className="text-xl font-black tracking-tighter italic uppercase text-white">Centro de Comando</h4>
                                                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Acceso directo a módulos</p>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                                 <QuickActionCard
                                                        title="Repartos"
                                                        subtitle="Rutas y Logística"
                                                        icon={<Truck className="w-6 h-6" />}
                                                        href="/repartos"
                                                        color="blue"
                                                 />
                                                 <QuickActionCard
                                                        title="Clientes"
                                                        subtitle="Fichas y Saldos"
                                                        icon={<Users className="w-6 h-6" />}
                                                        href="/clientes"
                                                        color="sky"
                                                 />
                                                 <QuickActionCard
                                                        title="Cuentas"
                                                        subtitle="Cobranzas Globales"
                                                        icon={<CreditCard className="w-6 h-6" />}
                                                        href="/cuentas"
                                                        color="rose"
                                                 />
                                                 <QuickActionCard
                                                        title="Caja"
                                                        subtitle="Gestión Financiera"
                                                        icon={<Banknote className="w-6 h-6" />}
                                                        href="/caja"
                                                        color="emerald"
                                                 />
                                          </div>
                                   </div>

                                   {/* Live Monitor Section */}
                                   <div className="space-y-8">
                                          <div className="space-y-2 px-2 flex justify-between items-end">
                                                 <div>
                                                        <h4 className="text-xl font-black tracking-tighter italic uppercase text-white">Live Monitor</h4>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Actividad reciente</p>
                                                 </div>
                                                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                          </div>
                                          <div className="p-8 rounded-[3rem] bg-black/40 border border-white/5 backdrop-blur-md">
                                                 <LiveActivityMonitor />
                                          </div>
                                   </div>
                            </div>
                     </div>

                     {/* FOOTER INFO */}
                     <footer className="pt-24 pb-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em] text-white/10 border-t border-white/5">
                            <div>© 2026 SODERIA NICO - PREMIUM COMMAND CENTER</div>
                            <div className="flex gap-10">
                                   <span>Status: Optimal</span>
                                   <span>Security: Active</span>
                            </div>
                     </footer>
              </div>
       );
}
