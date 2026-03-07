import { Truck, Users, CreditCard, Banknote, Activity, Calendar, Droplets, MapPin, TrendingUp, Clock, Inbox, ChevronRight, Share2, Printer } from "lucide-react";
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

       const currentDate = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

       return (
              <div className="flex flex-col min-h-screen bg-white">

                     {/* PREMIUM iOS HEADER AREA */}
                     <header className="px-6 pt-16 pb-12 sm:px-10 lg:px-16 animate-fade-in">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-10">
                                   <div className="space-y-3">
                                          <div className="flex flex-wrap items-center gap-3 mb-4">
                                                 <div className="px-4 py-1.5 bg-primary text-white rounded-full flex items-center gap-2 shadow-xl shadow-primary/20">
                                                        <TrendingUp className="w-4 h-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">+12% vs ayer</span>
                                                 </div>
                                                 <div className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full flex items-center gap-2 shadow-sm">
                                                        <Clock className="w-4 h-4 text-amber-600" />
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Horario normal</span>
                                                 </div>
                                          </div>
                                          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground leading-none">
                                                 Hola, {session?.user?.name?.split(' ')[0] || "Nico"}
                                          </h1>
                                          <div className="flex items-center gap-3 mt-4">
                                                 <div className="w-10 h-1 bg-primary rounded-full" />
                                                 <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">{currentDate}</span>
                                          </div>
                                   </div>

                                   <div className="w-full sm:w-auto flex sm:pb-3">
                                          <NewOrderButton />
                                   </div>
                            </div>
                     </header>

                     {/* DASHBOARD GRID */}
                     <main className="px-5 sm:px-8 lg:px-16 pb-40 space-y-20 animate-fade-in" style={{ animationDelay: '0.1s' }}>

                            {/* METRIC ROWS - High Impact */}
                            <section className="space-y-10">
                                   <div className="flex items-center justify-between px-3">
                                          <div className="flex items-center gap-3">
                                                 <div className="w-5 h-5 rounded-full border-4 border-slate-50 border-t-primary animate-spin" />
                                                 <h3 className="text-[14px] font-black text-foreground uppercase tracking-[0.2em]">Monitor de Desempeño</h3>
                                          </div>
                                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Tiempo Real</div>
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                          <MetricCard
                                                 label="Red de Clientes"
                                                 value={clientCount.toString()}
                                                 icon={<Users className="w-8 h-8" />}
                                                 color="blue"
                                                 href="/clientes"
                                          />
                                          <MetricCard
                                                 label="Entregas Totales"
                                                 value={orderCount.toString()}
                                                 icon={<Truck className="w-8 h-8" />}
                                                 color="purple"
                                                 href="/pedidos"
                                          />
                                          <MetricCard
                                                 label="Saldo Clientes"
                                                 value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                                 icon={<CreditCard className="w-8 h-8" />}
                                                 color="rose"
                                                 href="/cuentas"
                                          />
                                          <MetricCard
                                                 label="Rutas Activas"
                                                 value={activeDeliveries.toString()}
                                                 icon={<Activity className="w-8 h-8" />}
                                                 color="amber"
                                                 href="/repartos"
                                          />
                                   </div>
                            </section>

                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-20">

                                   {/* ANALYTICS SECTION - Center Widget */}
                                   <section className="xl:col-span-8 space-y-10">
                                          <div className="flex flex-col sm:flex-row items-center justify-between px-3 gap-6">
                                                 <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary/5 rounded-[1.2rem] flex items-center justify-center text-primary border border-primary/20">
                                                               <TrendingUp className="w-6 h-6 stroke-[2.5px]" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                               <h3 className="text-2xl font-black text-foreground tracking-tighter leading-tight">Ventas Estratégicas</h3>
                                                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Métricas de Producción</p>
                                                        </div>
                                                 </div>
                                                 <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner overflow-hidden whitespace-nowrap">
                                                        <button className="text-[10px] font-black px-6 py-2.5 rounded-[0.8rem] bg-white text-primary shadow-sm border border-slate-100 uppercase tracking-[0.15em] transition-all">Semanales</button>
                                                        <button className="text-[10px] font-black px-6 py-2.5 text-slate-500 uppercase tracking-[0.15em]">Mensuales</button>
                                                 </div>
                                          </div>
                                          <div className="p-8 sm:p-14 rounded-[4rem] bg-white border-4 border-slate-50 shadow-2xl shadow-slate-200/50 hover:shadow-slate-300/60 transition-all duration-700 group relative">
                                                 {/* Background Accents */}
                                                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />
                                                 <div className="relative z-10">
                                                        <AnalyticsDashboard />
                                                 </div>
                                          </div>
                                   </section>

                                   {/* SIDEBAR ACTIONS & ACTIVITY */}
                                   <aside className="xl:col-span-4 space-y-20">

                                          {/* ACCESS LIST - Quick Access Premium */}
                                          <div className="space-y-10">
                                                 <div className="flex items-center gap-4 px-3">
                                                        <Inbox className="w-5 h-5 text-primary opacity-70" />
                                                        <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.2em]">Enlace Rápido</h3>
                                                        <div className="h-px flex-1 bg-slate-50" />
                                                 </div>
                                                 <div className="flex flex-col gap-5 pr-2">
                                                        <QuickActionCard
                                                               title="Rutas de Reparto"
                                                               subtitle="Logística Geográfica"
                                                               icon={<MapPin className="w-6 h-6" />}
                                                               href="/repartos"
                                                               color="blue"
                                                        />
                                                        <QuickActionCard
                                                               title="Gestión de Cuentas"
                                                               subtitle="Cobranzas y Morosidad"
                                                               icon={<Banknote className="w-6 h-6" />}
                                                               href="/cuentas"
                                                               color="rose"
                                                        />
                                                        <QuickActionCard
                                                               title="Inventario Maestro"
                                                               subtitle="Sifones y Bidones"
                                                               icon={<Droplets className="w-6 h-6" />}
                                                               href="/productos"
                                                               color="sky"
                                                        />
                                                 </div>
                                          </div>

                                          {/* LIVE FEED - Integrated Monitor */}
                                          <div className="space-y-8">
                                                 <div className="flex items-center justify-between px-3">
                                                        <div className="flex items-center gap-4">
                                                               <Activity className="w-5 h-5 text-amber-600 opacity-70" />
                                                               <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.2em] leading-none pt-1">Auditoría en Vivo</h3>
                                                        </div>
                                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                                 </div>
                                                 <div className="rounded-[3rem] overflow-hidden border-2 border-slate-50 bg-slate-50/20 p-4 shadow-inner min-h-[400px]">
                                                        <LiveActivityMonitor />
                                                 </div>
                                          </div>
                                   </aside>
                            </div>
                     </main>

                     {/* PREMIUM iOS FOOTER */}
                     <footer className="mt-auto px-10 py-16 flex flex-col items-center gap-6 text-[10px] font-black text-slate-400 border-t border-slate-100 uppercase tracking-[0.4em] bg-slate-50/20 overflow-hidden relative">
                            <div className="absolute inset-0 opacity-10 flex justify-center items-center pointer-events-none select-none overflow-hidden scale-150 -z-10">
                                   <div className="text-[200px] font-black rotate-12 -translate-y-20">NICO</div>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-50 flex items-center justify-center shadow-2xl shadow-slate-200/50">
                                   <Droplets className="w-7 h-7 text-primary stroke-[2.5px]" />
                            </div>
                            <div className="flex items-center gap-6">
                                   <span>Sodería Nico App</span>
                                   <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                                   <span>Intelligent Logistics v2.5.0</span>
                                   <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                                   <span>Buenos Aires</span>
                            </div>
                            <p className="mt-4 opacity-30">Designed for Premium Productivity</p>
                     </footer>
              </div>
       );
}
