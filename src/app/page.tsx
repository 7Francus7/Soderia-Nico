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
              <div className="space-y-12 animate-fade-in-up">
                     {/* Welcome Section */}
                     <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                            <div className="space-y-4">
                                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                                          <Sparkles className="w-3.5 h-3.5 fill-primary" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sodería Nico OS v2.4.0</span>
                                   </div>
                                   <h2 className="text-5xl lg:text-8xl font-black tracking-tightest leading-[0.85] text-gradient">
                                          Hola, <br /><span className="italic">{userName.split(' ')[0]}</span>.
                                   </h2>
                                   <p className="text-slate-400 font-bold text-xl max-w-2xl flex items-center gap-3">
                                          <Calendar className="w-5 h-5 text-primary" />
                                          {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                          <span className="w-1 h-1 rounded-full bg-white/20" />
                                          <span className="text-foreground">{activeDeliveries} repartos hoy</span>
                                   </p>
                            </div>
                            <div className="flex items-center gap-4">
                                   <NewOrderButton />
                            </div>
                     </header>

                     {/* Primary Metrics Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <MetricCard
                                   label="Cartera Clientes"
                                   value={clientCount.toString()}
                                   icon={<Users className="w-6 h-6" />}
                                   description="Base de datos global"
                                   color="blue"
                            />
                            <MetricCard
                                   label="Ventas Entregadas"
                                   value={orderCount.toString()}
                                   icon={<Truck className="w-6 h-6" />}
                                   description="Pedidos exitosos"
                                   color="purple"
                            />
                            <MetricCard
                                   label="Crédito en Calle"
                                   value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                   icon={<CreditCard className="w-6 h-6" />}
                                   description="Deuda por cobrar"
                                   color="rose"
                            />
                            <MetricCard
                                   label="Status Operativo"
                                   value={activeDeliveries.toString()}
                                   icon={<Activity className="w-6 h-6" />}
                                   description="Repartos en curso"
                                   color="amber"
                                   href="/repartos"
                            />
                     </div>

                     {/* Strategic Navigation Grid */}
                     <section className="space-y-8">
                            <div className="flex flex-col gap-1">
                                   <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">Módulos Críticos</h3>
                                   <h4 className="text-3xl font-black tracking-tighter">Navegación Estratégica</h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                   <QuickActionCard
                                          title="Repartos"
                                          subtitle="Rutas y Logística"
                                          icon={<Truck className="w-7 h-7" />}
                                          href="/repartos"
                                          gradient="from-blue-600 to-indigo-600"
                                   />
                                   <QuickActionCard
                                          title="Clientes"
                                          subtitle="Fichas y Saldos"
                                          icon={<Users className="w-7 h-7" />}
                                          href="/clientes"
                                          gradient="from-sky-600 to-blue-600"
                                   />
                                   <QuickActionCard
                                          title="Cuentas"
                                          subtitle="Cobranzas"
                                          icon={<CreditCard className="w-7 h-7" />}
                                          href="/cuentas"
                                          gradient="from-rose-600 to-orange-600"
                                   />
                                   <QuickActionCard
                                          title="Caja"
                                          subtitle="Finanzas"
                                          icon={<Banknote className="w-7 h-7" />}
                                          href="/caja"
                                          gradient="from-emerald-600 to-teal-600"
                                   />
                            </div>
                     </section>

                     {/* Analytics & Charts */}
                     <section className="space-y-10 pt-10">
                            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                   <div className="space-y-1 text-right ml-auto">
                                          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 justify-end">
                                                 Sodería Analytics
                                                 <TrendingUp className="w-7 h-7 text-primary" />
                                          </h3>
                                          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Reporte de Rendimiento 7 días</p>
                                   </div>
                            </div>
                            <div className="p-1 rounded-[3.5rem] bg-gradient-to-br from-white/5 to-transparent shadow-3xl hover-pro">
                                   <AnalyticsDashboard />
                            </div>
                     </section>
              </div>
       );
}

function MetricCard({ label, value, icon, description, color, href }: any) {
       const colors: any = {
              blue: "from-blue-500/20 to-transparent border-blue-500/20 text-blue-500",
              purple: "from-primary/20 to-transparent border-primary/20 text-primary",
              rose: "from-rose-500/20 to-transparent border-rose-500/20 text-rose-500",
              amber: "from-amber-500/20 to-transparent border-amber-500/20 text-amber-500",
       };

       const Content = (
              <Card className={cn(
                     "p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] border bg-gradient-to-br transition-all duration-700 group relative overflow-hidden h-full flex flex-col justify-between hover-pro glass-card",
                     colors[color]
              )}>
                     <div className="absolute -right-8 -top-8 w-40 h-40 bg-current opacity-[0.03] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />

                     <div className="flex justify-between items-start mb-8 lg:mb-10">
                            <div className="p-3 lg:p-4 rounded-2xl lg:rounded-3xl bg-slate-950 border border-white/10 shadow-2xl group-hover:rotate-12 transition-all duration-500">
                                   {icon}
                            </div>
                            <div className="opacity-0 lg:group-hover:opacity-100 transition-all translate-x-4 lg:group-hover:translate-x-0">
                                   <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
                            </div>
                     </div>

                     <div>
                            <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">{label}</p>
                            <h4 className="text-4xl lg:text-6xl font-black tracking-tightest mb-3 leading-none">{value}</h4>
                            <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{description}</p>
                     </div>
              </Card>
       );

       return href ? <Link href={href} className="block group">{Content}</Link> : Content;
}

function QuickActionCard({ title, subtitle, icon, href, gradient }: any) {
       return (
              <Link href={href} className="group block hover-pro">
                     <Card className="p-8 rounded-[3rem] border border-white/5 bg-slate-900/40 backdrop-blur-3xl hover:bg-slate-900/60 hover:border-white/20 transition-all duration-500 shadow-2xl overflow-hidden relative shimmer">
                            <div className={cn(
                                   "absolute top-0 right-0 w-40 h-40 bg-gradient-to-br opacity-[0.07] rounded-bl-[120px] transition-all duration-700 group-hover:scale-150 group-hover:opacity-20",
                                   gradient
                            )} />

                            <div className="flex items-center gap-6 relative z-10">
                                   <div className={cn(
                                          "w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-2xl bg-gradient-to-br transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110",
                                          gradient
                                   )}>
                                          {icon}
                                   </div>
                                   <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                                 <h4 className="font-black text-2xl tracking-tighter uppercase italic">{title}</h4>
                                                 <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                          </div>
                                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">{subtitle}</p>
                                   </div>
                            </div>
                     </Card>
              </Link>
       );
}
