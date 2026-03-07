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
              <div className="flex flex-col min-h-screen bg-background text-foreground">

                     {/* GOOGLE PROFESSIONAL HEADER AREA */}
                     <header className="px-6 pt-12 pb-10 sm:px-10 lg:px-16 animate-fade-in">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                   <div className="space-y-2">
                                          <div className="flex flex-wrap items-center gap-2 mb-2">
                                                 <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center gap-2">
                                                        <TrendingUp className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">+12% vs ayer</span>
                                                 </div>
                                                 <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider italic">Horario normal</span>
                                                 </div>
                                          </div>
                                          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                                                 Hola, {session?.user?.name?.split(' ')[0] || "Administrador"}
                                          </h1>
                                          <div className="flex items-center gap-2 mt-1">
                                                 <div className="w-8 h-0.5 bg-primary/40 rounded-full" />
                                                 <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{currentDate}</span>
                                          </div>
                                   </div>

                                   <div className="w-full sm:w-auto flex">
                                          <NewOrderButton />
                                   </div>
                            </div>
                     </header>

                     {/* DASHBOARD GRID */}
                     <main className="px-5 sm:px-8 lg:px-16 pb-24 space-y-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>

                            {/* METRIC ROWS - High Impact */}
                            <section className="space-y-6">
                                   <div className="flex items-center justify-between px-1">
                                          <div className="flex items-center gap-2">
                                                 <div className="w-2 h-2 rounded-full bg-primary" />
                                                 <h3 className="text-[12px] font-bold text-foreground uppercase tracking-wider">Monitor de Desempeño</h3>
                                          </div>
                                          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Tiempo Real</div>
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                          <MetricCard
                                                 label="Red de Clientes"
                                                 value={clientCount.toString()}
                                                 icon={<Users className="w-6 h-6" />}
                                                 color="blue"
                                                 href="/clientes"
                                          />
                                          <MetricCard
                                                 label="Entregas Totales"
                                                 value={orderCount.toString()}
                                                 icon={<Truck className="w-6 h-6" />}
                                                 color="purple"
                                                 href="/pedidos"
                                          />
                                          <MetricCard
                                                 label="Saldo Clientes"
                                                 value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                                 icon={<CreditCard className="w-6 h-6" />}
                                                 color="rose"
                                                 href="/cuentas"
                                          />
                                          <MetricCard
                                                 label="Rutas Activas"
                                                 value={activeDeliveries.toString()}
                                                 icon={<Activity className="w-6 h-6" />}
                                                 color="amber"
                                                 href="/repartos"
                                          />
                                   </div>
                            </section>

                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">

                                   {/* ANALYTICS SECTION - Center Widget */}
                                   <section className="xl:col-span-8 space-y-6">
                                          <div className="flex flex-col sm:flex-row items-center justify-between px-1 gap-4">
                                                 <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                                               <TrendingUp className="w-5 h-5 stroke-[2px]" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                               <h3 className="text-xl font-bold text-foreground tracking-tight">Ventas Estratégicas</h3>
                                                               <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Métricas de Producción</p>
                                                        </div>
                                                 </div>
                                                 <div className="flex p-1 bg-secondary rounded-xl border border-border shadow-sm overflow-hidden whitespace-nowrap">
                                                        <button className="text-[10px] font-bold px-5 py-2 rounded-lg bg-background text-primary shadow-sm border border-border uppercase tracking-wide transition-all">Semanales</button>
                                                        <button className="text-[10px] font-bold px-5 py-2 text-muted-foreground uppercase tracking-wide">Mensuales</button>
                                                 </div>
                                          </div>
                                          <div className="p-6 sm:p-8 rounded-[1.5rem] bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-300 group relative overflow-hidden">
                                                 {/* Subtle Background Accent */}
                                                 <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none opacity-40" />
                                                 <div className="relative z-10">
                                                        <AnalyticsDashboard />
                                                 </div>
                                          </div>
                                   </section>

                                   {/* SIDEBAR ACTIONS & ACTIVITY */}
                                   <aside className="xl:col-span-4 space-y-12">

                                          {/* ACCESS LIST - Quick Access Premium */}
                                          <div className="space-y-6">
                                                 <div className="flex items-center gap-2 px-1">
                                                        <Inbox className="w-4 h-4 text-primary" />
                                                        <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">Enlaces Rápidos</h3>
                                                        <div className="h-px flex-1 bg-border/50 ml-2" />
                                                 </div>
                                                 <div className="flex flex-col gap-4">
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
                                                               title="Inventario Maestro"
                                                               subtitle="Sifones y Bidones"
                                                               icon={<Droplets className="w-5 h-5" />}
                                                               href="/productos"
                                                               color="sky"
                                                        />
                                                 </div>
                                          </div>

                                          {/* LIVE FEED - Integrated Monitor */}
                                          <div className="space-y-6">
                                                 <div className="flex items-center justify-between px-1">
                                                        <div className="flex items-center gap-3">
                                                               <Activity className="w-4 h-4 text-emerald-600" />
                                                               <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">Auditoría en Vivo</h3>
                                                        </div>
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                 </div>
                                                 <div className="rounded-[1.5rem] overflow-hidden border border-border bg-card p-4 shadow-sm min-h-[400px]">
                                                        <LiveActivityMonitor />
                                                 </div>
                                          </div>
                                   </aside>
                            </div>
                     </main>

                     {/* REFINED FOOTER */}
                     <footer className="mt-auto px-10 py-12 flex flex-col items-center gap-4 text-[10px] font-bold text-muted-foreground border-t border-border bg-secondary/30 relative overflow-hidden">
                            <div className="flex items-center gap-6">
                                   <span>Sodería Nico App</span>
                                   <div className="w-1 h-1 rounded-full bg-border" />
                                   <span>Intelligent Logistics v2.5.0</span>
                                   <div className="w-1 h-1 rounded-full bg-border" />
                                   <span>Buenos Aires</span>
                            </div>
                            <p className="opacity-60">Google Professional Interface Upgrade</p>
                     </footer>
              </div>
       );
}
