import { Truck, Users, CreditCard, Banknote, Activity, Calendar, Droplets, MapPin, TrendingUp, Clock } from "lucide-react";
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
              <div className="flex flex-col min-h-screen bg-white">

                     {/* PREMIUM iOS HEADER AREA */}
                     <header className="px-6 pt-10 pb-8 sm:px-10 lg:px-16 animate-fade-in-up">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                                   <div className="space-y-1">
                                          <div className="flex items-center gap-2 mb-2">
                                                 <div className="px-2.5 py-1 bg-primary/10 rounded-full border border-primary/20 flex items-center gap-1.5 shadow-sm">
                                                        <TrendingUp className="w-3 h-3 text-primary" />
                                                        <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">+12% vs ayer</span>
                                                 </div>
                                                 <div className="px-2.5 py-1 bg-amber-50 rounded-full border border-amber-100 flex items-center gap-1.5 shadow-sm">
                                                        <Clock className="w-3 h-3 text-amber-500" />
                                                        <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest">En horario</span>
                                                 </div>
                                          </div>
                                          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
                                                 Hola, {session?.user?.name?.split(' ')[0] || "Nico"}
                                          </h1>
                                          <div className="flex items-center gap-1.5 mt-2">
                                                 <div className="w-6 h-1 bg-primary rounded-full" />
                                                 <span className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">{currentDate}</span>
                                          </div>
                                   </div>

                                   <div className="flex sm:pb-1">
                                          <NewOrderButton />
                                   </div>
                            </div>
                     </header>

                     {/* DASHBOARD GRID */}
                     <main className="px-5 sm:px-8 lg:px-16 pb-32 space-y-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

                            {/* METRIC ROWS */}
                            <section className="space-y-6">
                                   <div className="flex items-center justify-between px-2">
                                          <div className="flex items-center gap-2">
                                                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                 <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.15em]">Resumen en vivo</h3>
                                          </div>
                                   </div>
                                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                          <MetricCard
                                                 label="Clientes"
                                                 value={clientCount.toString()}
                                                 icon={<Users className="w-5.5 h-5.5" />}
                                                 color="blue"
                                                 href="/clientes"
                                          />
                                          <MetricCard
                                                 label="Entregas"
                                                 value={orderCount.toString()}
                                                 icon={<Truck className="w-5.5 h-5.5" />}
                                                 color="purple"
                                                 href="/pedidos"
                                          />
                                          <MetricCard
                                                 label="Saldo Clientes"
                                                 value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                                 icon={<CreditCard className="w-5.5 h-5.5" />}
                                                 color="rose"
                                                 href="/cuentas"
                                          />
                                          <MetricCard
                                                 label="Rutas Activas"
                                                 value={activeDeliveries.toString()}
                                                 icon={<Activity className="w-5.5 h-5.5" />}
                                                 color="amber"
                                                 href="/repartos"
                                          />
                                   </div>
                            </section>

                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">

                                   {/* ANALYTICS SECTION */}
                                   <section className="xl:col-span-8 space-y-6">
                                          <div className="flex items-center justify-between px-2">
                                                 <div className="flex items-center gap-2">
                                                        <Droplets className="w-4 h-4 text-primary" />
                                                        <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.15em]">Rendimiento de Ventas</h3>
                                                 </div>
                                                 <div className="flex gap-1.5">
                                                        <button className="text-[10px] font-bold bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg active:bg-slate-100 transition-colors uppercase tracking-wider">7 días</button>
                                                        <button className="text-[10px] font-bold text-muted-foreground/50 px-3 py-1.5 uppercase tracking-wider">30 días</button>
                                                 </div>
                                          </div>
                                          <div className="p-4 sm:p-10 rounded-[2.5rem] bg-white border border-border/40 shadow-[0_15px_60px_rgba(0,0,0,0.03)] overflow-hidden">
                                                 <AnalyticsDashboard />
                                          </div>
                                   </section>

                                   {/* SIDEBAR ACTIONS & ACTIVITY */}
                                   <aside className="xl:col-span-4 space-y-12">

                                          {/* ACCESS LIST */}
                                          <div className="space-y-6">
                                                 <div className="flex items-center gap-2 px-2">
                                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                        <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.15em]">Atajos de Gestión</h3>
                                                 </div>
                                                 <div className="flex flex-col gap-3">
                                                        <QuickActionCard
                                                               title="Rutas de Reparto"
                                                               subtitle="Logística Geográfica"
                                                               icon={<MapPin className="w-5 h-5" />}
                                                               href="/repartos"
                                                               color="blue"
                                                        />
                                                        <QuickActionCard
                                                               title="Gestión de Cuentas"
                                                               subtitle="Cobranzas y Morosidad"
                                                               icon={<Banknote className="w-5 h-5" />}
                                                               href="/cuentas"
                                                               color="rose"
                                                        />
                                                        <QuickActionCard
                                                               title="Inventario"
                                                               subtitle="Sifones y Bidones"
                                                               icon={<Droplets className="w-5 h-5" />}
                                                               href="/productos"
                                                               color="sky"
                                                        />
                                                 </div>
                                          </div>

                                          {/* LIVE FEED */}
                                          <div className="space-y-6">
                                                 <div className="flex items-center gap-2 px-2">
                                                        <Activity className="w-4 h-4 text-amber-500" />
                                                        <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.15em]">Monitor de Actividad</h3>
                                                 </div>
                                                 <div className="rounded-[2rem] overflow-hidden border border-border/40 bg-slate-50/30 p-2">
                                                        <LiveActivityMonitor />
                                                 </div>
                                          </div>
                                   </aside>
                            </div>
                     </main>

                     {/* PREMIUM iOS FOOTER */}
                     <footer className="mt-auto px-10 py-12 flex flex-col items-center gap-4 text-[10px] font-bold text-muted-foreground/30 border-t border-border/20 uppercase tracking-[0.3em]">
                            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center opacity-50">
                                   <Droplets className="w-4 h-4" />
                            </div>
                            <span>© 2026 Sodería Nico — v2.5.0 Premium</span>
                     </footer>
              </div>
       );
}
