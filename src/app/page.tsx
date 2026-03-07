"use strict";

import { Truck, Users, CreditCard, Banknote, Activity, Calendar } from "lucide-react";
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
              <div className="page-container space-y-6">

                     {/* PAGE HEADER */}
                     <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-5 border-b border-border">
                            <div>
                                   <h2 className="text-xl font-bold text-foreground">Panel Principal</h2>
                                   <div className="flex items-center gap-2 mt-1">
                                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                          <span className="text-xs text-muted-foreground capitalize">{currentDate}</span>
                                          <span className="text-muted-foreground/30">·</span>
                                          <div className="flex items-center gap-1.5">
                                                 <Activity className="w-3 h-3 text-emerald-500" />
                                                 <span className="text-xs text-muted-foreground">{activeDeliveries} rutas activas</span>
                                          </div>
                                   </div>
                            </div>

                            <NewOrderButton />
                     </header>

                     {/* METRICS */}
                     <section>
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Resumen</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                   <MetricCard
                                          label="Clientes"
                                          value={clientCount.toString()}
                                          icon={<Users className="w-4 h-4" />}
                                          color="blue"
                                          href="/clientes"
                                   />
                                   <MetricCard
                                          label="Entregas"
                                          value={orderCount.toString()}
                                          icon={<Truck className="w-4 h-4" />}
                                          color="purple"
                                          href="/pedidos"
                                   />
                                   <MetricCard
                                          label="Crédito"
                                          value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                          icon={<CreditCard className="w-4 h-4" />}
                                          color="rose"
                                          href="/cuentas"
                                   />
                                   <MetricCard
                                          label="En Ruta"
                                          value={activeDeliveries.toString()}
                                          icon={<Activity className="w-4 h-4" />}
                                          color="amber"
                                          href="/repartos"
                                   />
                            </div>
                     </section>

                     {/* MAIN CONTENT GRID */}
                     <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                            {/* Analytics Chart */}
                            <div className="xl:col-span-8 space-y-4">
                                   <div className="flex items-center justify-between">
                                          <h3 className="text-sm font-semibold text-foreground">Análisis Operativo</h3>
                                          <span className="text-xs text-muted-foreground">Rendimiento semanal</span>
                                   </div>
                                   <div className="p-4 sm:p-6 rounded-xl bg-white border border-border card-shadow">
                                          <AnalyticsDashboard />
                                   </div>
                            </div>

                            {/* Quick Actions + Live Monitor */}
                            <div className="xl:col-span-4 space-y-6">
                                   {/* Quick Actions */}
                                   <div className="space-y-3">
                                          <h3 className="text-sm font-semibold text-foreground">Acceso Rápido</h3>
                                          <div className="space-y-2">
                                                 <QuickActionCard
                                                        title="Repartos"
                                                        subtitle="Rutas y logística"
                                                        icon={<Truck className="w-4 h-4" />}
                                                        href="/repartos"
                                                        color="blue"
                                                 />
                                                 <QuickActionCard
                                                        title="Clientes"
                                                        subtitle="Fichas y saldos"
                                                        icon={<Users className="w-4 h-4" />}
                                                        href="/clientes"
                                                        color="sky"
                                                 />
                                                 <QuickActionCard
                                                        title="Cuentas"
                                                        subtitle="Cobranzas"
                                                        icon={<CreditCard className="w-4 h-4" />}
                                                        href="/cuentas"
                                                        color="rose"
                                                 />
                                                 <QuickActionCard
                                                        title="Caja"
                                                        subtitle="Financiero"
                                                        icon={<Banknote className="w-4 h-4" />}
                                                        href="/caja"
                                                        color="emerald"
                                                 />
                                          </div>
                                   </div>

                                   {/* Live Monitor */}
                                   <div className="space-y-3">
                                          <h3 className="text-sm font-semibold text-foreground">Actividad Reciente</h3>
                                          <LiveActivityMonitor />
                                   </div>
                            </div>
                     </div>

                     {/* FOOTER */}
                     <footer className="pt-4 pb-2 flex justify-between items-center text-[10px] text-muted-foreground border-t border-border">
                            <span>© 2026 Sodería Nico</span>
                            <span>v2.5.0</span>
                     </footer>
              </div>
       );
}
