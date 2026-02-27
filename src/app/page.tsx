import { Truck, Users, CreditCard, Banknote, Activity } from "lucide-react";
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

       const userName = session?.user?.name || "Nico";

       return (
              <div className="max-w-screen-2xl mx-auto space-y-16 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
                     {/* Welcome Section */}
                     <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                            <div className="space-y-6">
                                   <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary">
                                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                          <span className="text-[11px] font-medium uppercase tracking-wider">v2.4.0 — Estable</span>
                                   </div>
                                   <div className="space-y-2">
                                          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground">
                                                 Hola, <span className="text-muted-foreground">{userName.split(' ')[0]}</span>.
                                          </h2>
                                          <p className="text-muted-foreground font-medium text-lg flex items-center gap-2">
                                                 {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                 <span className="text-border">|</span>
                                                 {activeDeliveries} repartos hoy
                                          </p>
                                   </div>
                            </div>
                            <div className="flex items-center gap-4">
                                   <NewOrderButton />
                            </div>
                     </header>

                     {/* Primary Metrics Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard
                                   label="Clientes"
                                   value={clientCount.toString()}
                                   icon={<Users className="w-5 h-5" />}
                                   color="blue"
                                   href="/clientes"
                            />
                            <MetricCard
                                   label="Ventas"
                                   value={orderCount.toString()}
                                   icon={<Truck className="w-5 h-5" />}
                                   color="purple"
                                   href="/pedidos"
                            />
                            <MetricCard
                                   label="Crédito"
                                   value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                   icon={<CreditCard className="w-5 h-5" />}
                                   color="rose"
                                   href="/cuentas"
                            />
                            <MetricCard
                                   label="Activos"
                                   value={activeDeliveries.toString()}
                                   icon={<Activity className="w-5 h-5" />}
                                   color="amber"
                                   href="/repartos"
                            />
                     </div>

                     {/* Strategic Navigation Grid */}
                     <section className="space-y-8">
                            <div className="space-y-1">
                                   <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Operaciones</h3>
                                   <h4 className="text-2xl font-semibold tracking-tight">Acciones Rápidas</h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                          subtitle="Finanzas"
                                          icon={<Banknote className="w-5 h-5" />}
                                          href="/caja"
                                          color="emerald"
                                   />
                            </div>
                     </section>

                     {/* Analytics & Command Center */}
                     <section className="space-y-8 border-t border-border pt-16">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                   <div className="space-y-1">
                                          <h3 className="text-2xl font-semibold tracking-tight">Análisis Operativo</h3>
                                          <p className="text-muted-foreground text-sm font-medium">Panel de control y actividad en tiempo real</p>
                                   </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                   <div className="lg:col-span-2 space-y-8">
                                          <AnalyticsDashboard />
                                   </div>
                                   <div className="lg:col-span-1">
                                          <LiveActivityMonitor />
                                   </div>
                            </div>
                     </section>
              </div>
       );
}

