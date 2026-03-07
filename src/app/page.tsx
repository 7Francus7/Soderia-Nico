"use strict";

import { Truck, Users, CreditCard, Banknote, Activity, MapPin, TrendingUp, Clock, Inbox, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import NewOrderButton from "@/components/orders/NewOrderButton";
import LiveActivityMonitor from "@/components/dashboard/LiveActivityMonitor";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { getARRelativeDate } from "@/lib/date-utils";

export default async function Home() {
       const session = await getServerSession(authOptions);
       const [clientCount, orderCount, totalDebt, activeDeliveries] = await Promise.all([
              prisma.client.count(),
              prisma.order.count({ where: { status: "DELIVERED" } }),
              prisma.client.aggregate({ _sum: { balance: true } }),
              prisma.delivery.count({ where: { status: "IN_PROGRESS" } })
       ]);

       const currentDate = getARRelativeDate();

       return (
              <div className="flex flex-col min-h-screen">
                     {/* Dashboard Header */}
                     <header className="page-container pb-8 pt-12">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                   <div className="space-y-1.5">
                                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                                 <Clock className="w-4 h-4" />
                                                 <span className="text-[11px] font-bold uppercase tracking-[0.15em]">{currentDate}</span>
                                          </div>
                                          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                                                 Sodería <span className="text-primary tracking-tighter">Nico</span>
                                          </h1>
                                          <p className="text-muted-foreground font-medium">Bienvenido de nuevo, {session?.user?.name?.split(' ')[0] || "Administrador"}.</p>
                                   </div>

                                   <div className="flex items-center gap-3">
                                          <NewOrderButton />
                                   </div>
                            </div>
                     </header>

                     <main className="page-container pt-0 pb-20 space-y-12">
                            {/* KPI Metrics */}
                            <section>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                          <MetricCard
                                                 label="CLIENTES TOTALES"
                                                 value={clientCount.toLocaleString()}
                                                 icon={<Users />}
                                                 description="Red Comercial Activa"
                                                 href="/clientes"
                                                 variant="blue"
                                          />
                                          <MetricCard
                                                 label="PEDIDOS ENTREGADOS"
                                                 value={orderCount.toLocaleString()}
                                                 icon={<Truck />}
                                                 description="Operaciones Exitosas"
                                                 href="/pedidos"
                                                 variant="purple"
                                          />
                                          <MetricCard
                                                 label="SALDO EN CALLE"
                                                 value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                                 icon={<CreditCard />}
                                                 description="Cuentas Corrientes"
                                                 href="/cuentas"
                                                 variant="rose"
                                          />
                                          <MetricCard
                                                 label="RUTAS DE REPARTO"
                                                 value={activeDeliveries.toLocaleString()}
                                                 icon={<Activity />}
                                                 description="Logística en Curso"
                                                 href="/repartos"
                                                 variant="amber"
                                          />
                                   </div>
                            </section>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
                                   {/* Analytics Section */}
                                   <section className="lg:col-span-8 space-y-6">
                                          <div className="flex items-center justify-between mb-2">
                                                 <div className="flex items-center gap-3">
                                                        <div className="p-2.5 bg-primary/10 rounded-xl">
                                                               <TrendingUp className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <h3 className="text-xl font-bold tracking-tight">Rendimiento Operativo</h3>
                                                 </div>
                                                 <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-xl border border-border/50">
                                                        <button className="px-4 py-1.5 bg-white shadow-sm border border-border text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all">Semanal</button>
                                                        <button className="px-4 py-1.5 text-muted-foreground text-[10px] font-bold uppercase tracking-wider hover:text-foreground transition-all">Mensual</button>
                                                 </div>
                                          </div>
                                          <div className="bg-white rounded-xl border border-border shadow-sm p-6 sm:p-10 min-h-[450px]">
                                                 <AnalyticsDashboard />
                                          </div>
                                   </section>

                                   {/* Side Information */}
                                   <aside className="lg:col-span-4 space-y-12">
                                          {/* Action Shortcuts */}
                                          <div className="space-y-6">
                                                 <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                                        <Inbox className="w-4 h-4 opacity-40" />
                                                        Accesos Rápidos
                                                 </h3>
                                                 <div className="grid grid-cols-1 gap-4">
                                                        <QuickActionCard
                                                               title="Mapa de Repartos"
                                                               icon={<MapPin className="w-4 h-4" />}
                                                               href="/repartos"
                                                               color="primary"
                                                        />
                                                        <QuickActionCard
                                                               title="Reporte de Deudas"
                                                               icon={<Banknote className="w-4 h-4" />}
                                                               href="/cuentas"
                                                               color="rose"
                                                        />
                                                        <QuickActionCard
                                                               title="Configuración"
                                                               icon={<Activity className="w-4 h-4" />}
                                                               href="/config"
                                                               color="slate"
                                                        />
                                                 </div>
                                          </div>

                                          {/* Activity Monitor */}
                                          <div className="space-y-6">
                                                 <div className="flex items-center justify-between px-1">
                                                        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                                               <Activity className="w-4 h-4 opacity-40" />
                                                               Monitor en Vivo
                                                        </h3>
                                                        <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(30,142,62,0.5)]" />
                                                 </div>
                                                 <div className="bg-white rounded-xl border border-border shadow-sm p-2 overflow-hidden min-h-[400px]">
                                                        <LiveActivityMonitor />
                                                 </div>
                                          </div>
                                   </aside>
                            </div>
                     </main>

                     {/* Footer */}
                     <footer className="mt-auto border-t border-border bg-white py-10 px-16 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                   <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                                          <Droplet className="w-4 h-4 text-primary fill-current" />
                                   </div>
                                   <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Sodería Nico Pro v2.6.0</span>
                            </div>
                            <div className="flex items-center gap-8">
                                   <span className="text-[11px] font-medium text-muted-foreground underline underline-offset-4 decoration-border cursor-pointer hover:text-primary transition-colors">Soporte Técnico</span>
                                   <span className="text-[11px] font-medium text-muted-foreground underline underline-offset-4 decoration-border cursor-pointer hover:text-primary transition-colors">Manual de Uso</span>
                            </div>
                     </footer>
              </div>
       );
}
