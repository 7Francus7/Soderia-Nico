import { Truck, Users, CreditCard, Droplets, ArrowRight, Box, Banknote, ShoppingBag, ShieldCheck, TrendingUp, Calendar, MapPin, Sparkles, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Card } from "@/components/ui/card";
import NewOrderButton from "@/components/NewOrderButton";
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

       return (
              <div className="p-6 lg:p-12 space-y-12 animate-fade-in">
                     {/* Dynamic Background */}
                     <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                            <div className="absolute top-[-15%] right-[-5%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
                            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
                     </div>

                     {/* Welcome Section */}
                     <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                            <div className="space-y-3">
                                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary shadow-2xl">
                                          <Sparkles className="w-3.5 h-3.5 fill-primary" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sodería Nico Premium v2</span>
                                   </div>
                                   <h2 className="text-5xl lg:text-7xl font-black tracking-tightest leading-none">
                                          Bienvenido, <span className="text-primary italic">{userName.split(' ')[0]}</span>.
                                   </h2>
                                   <p className="text-muted-foreground font-medium text-xl max-w-2xl">
                                          Hoy es {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}. Tienes <span className="text-foreground font-bold">{activeDeliveries} repartos</span> activos.
                                   </p>
                            </div>
                            <div className="flex items-center gap-4">
                                   <NewOrderButton />
                            </div>
                     </header>

                     {/* Primary Metrics Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <MetricCard
                                   label="Cartera de Clientes"
                                   value={clientCount.toString()}
                                   icon={<Users className="w-6 h-6" />}
                                   description="Base de datos total"
                                   color="blue"
                            />
                            <MetricCard
                                   label="Ventas Entregadas"
                                   value={orderCount.toString()}
                                   icon={<Truck className="w-6 h-6" />}
                                   description="Pedidos completos"
                                   color="purple"
                            />
                            <MetricCard
                                   label="Crédito a Favor"
                                   value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                   icon={<CreditCard className="w-6 h-6" />}
                                   description="Deuda total en calle"
                                   color="rose"
                            />
                            <MetricCard
                                   label="Repartos Activos"
                                   value={activeDeliveries.toString()}
                                   icon={<Activity className="w-6 h-6" />}
                                   description="En curso hoy"
                                   color="amber"
                                   href="/repartos"
                            />
                     </div>

                     {/* Analytics & Charts */}
                     <section className="space-y-8">
                            <div className="flex items-center justify-between">
                                   <div className="space-y-1">
                                          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                                 <TrendingUp className="w-7 h-7 text-primary" />
                                                 Rendimiento Operativo
                                          </h3>
                                          <p className="text-muted-foreground text-sm font-medium">Estadísticas detalladas de los últimos 7 días</p>
                                   </div>
                            </div>
                            <div className="p-1 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent">
                                   <AnalyticsDashboard />
                            </div>
                     </section>

                     {/* Strategic Navigation Grid */}
                     <section className="space-y-8">
                            <div className="flex items-center justify-between">
                                   <div className="space-y-1">
                                          <h3 className="text-2xl font-black tracking-tight uppercase italic opacity-20">Módulos Estratégicos</h3>
                                   </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                   <QuickActionCard
                                          title="Repartos"
                                          subtitle="Gestión de rutas y choferes"
                                          icon={<Truck className="w-7 h-7" />}
                                          href="/repartos"
                                          colorClass="from-indigo-600 to-indigo-400"
                                   />
                                   <QuickActionCard
                                          title="Clientes"
                                          subtitle="Fichas y estados de cuenta"
                                          icon={<Users className="w-7 h-7" />}
                                          href="/clientes"
                                          colorClass="from-blue-600 to-blue-400"
                                   />
                                   <QuickActionCard
                                          title="Cuentas"
                                          subtitle="Saldos y deudores"
                                          icon={<CreditCard className="w-7 h-7" />}
                                          href="/cuentas"
                                          colorClass="from-rose-600 to-rose-400"
                                   />
                                   <QuickActionCard
                                          title="Caja"
                                          subtitle="Arqueo diario y movimientos"
                                          icon={<Banknote className="w-7 h-7" />}
                                          href="/caja"
                                          colorClass="from-emerald-600 to-emerald-400"
                                   />
                            </div>
                     </section>
              </div>
       );
}

function MetricCard({ label, value, icon, description, color, href }: any) {
       const colors: any = {
              blue: "from-blue-500/10 to-transparent border-blue-500/20 text-blue-500 shadow-blue-500/5",
              purple: "from-primary/10 to-transparent border-primary/20 text-primary shadow-primary/5",
              rose: "from-rose-500/10 to-transparent border-rose-500/20 text-rose-500 shadow-rose-500/5",
              amber: "from-amber-500/10 to-transparent border-amber-500/20 text-amber-500 shadow-amber-500/5",
       };

       const Content = (
              <Card className={cn(
                     "p-10 rounded-[3rem] border bg-gradient-to-br transition-all duration-500 group relative overflow-hidden h-full flex flex-col justify-between",
                     colors[color]
              )}>
                     <div className="absolute -right-4 -top-4 w-32 h-32 bg-current opacity-[0.03] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                     <div className="flex justify-between items-start mb-6">
                            <div className="p-4 rounded-2.5xl bg-card border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                   {icon}
                            </div>
                            <div className="opacity-10 group-hover:opacity-100 transition-opacity">
                                   <ChevronRight className="w-6 h-6" />
                            </div>
                     </div>

                     <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</p>
                            <h4 className="text-5xl font-black tracking-tightest mb-2">{value}</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">{description}</p>
                     </div>
              </Card>
       );

       return href ? <Link href={href} className="block group">{Content}</Link> : Content;
}

function QuickActionCard({ title, subtitle, icon, href, colorClass }: any) {
       return (
              <Link href={href} className="group block">
                     <Card className="p-8 rounded-[2.5rem] border border-white/5 bg-card/40 backdrop-blur-3xl hover:bg-card/60 hover:border-white/10 transition-all duration-500 shadow-xl overflow-hidden relative">
                            <div className={cn(
                                   "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.05] rounded-bl-[100px] transition-all duration-500 group-hover:scale-150",
                                   colorClass
                            )} />

                            <div className="flex items-center gap-6 relative z-10">
                                   <div className={cn(
                                          "w-16 h-16 rounded-2.5xl flex items-center justify-center text-white shadow-2xl bg-gradient-to-br transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110",
                                          colorClass
                                   )}>
                                          {icon}
                                   </div>
                                   <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                                 <h4 className="font-black text-2xl tracking-tighter">{title}</h4>
                                                 <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                          </div>
                                          <p className="text-xs font-bold text-muted-foreground opacity-60 leading-tight">{subtitle}</p>
                                   </div>
                            </div>
                     </Card>
              </Link>
       );
}
