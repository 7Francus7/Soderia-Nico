import { Truck, Users, CreditCard, Droplets, ArrowRight, Box, Banknote, ShoppingBag, ShieldCheck, TrendingUp, Calendar, MapPin, Sparkles, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Card } from "@/components/ui/card";
import NewOrderButton from "@/components/NewOrderButton";
import { cn } from "@/lib/utils";
import LiveActivityMonitor from "@/components/LiveActivityMonitor";

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
              <div className="max-w-7xl mx-auto space-y-16 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
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
                            />
                            <MetricCard
                                   label="Ventas"
                                   value={orderCount.toString()}
                                   icon={<Truck className="w-5 h-5" />}
                                   color="purple"
                            />
                            <MetricCard
                                   label="Crédito"
                                   value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                   icon={<CreditCard className="w-5 h-5" />}
                                   color="rose"
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

function MetricCard({ label, value, icon, color, href }: any) {
       const colors: any = {
              blue: "border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/5",
              purple: "border-purple-500/20 text-purple-600 dark:text-purple-400 bg-purple-500/5",
              rose: "border-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-500/5",
              amber: "border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/5",
       };

       const Content = (
              <Card className={cn(
                     "p-8 rounded-2xl border transition-all duration-300 group relative flex flex-col justify-between hover:shadow-lg hover:border-primary/20 bg-card",
                     colors[color]
              )}>
                     <div className="flex justify-between items-start mb-6">
                            <div className="p-2.5 rounded-xl bg-background border border-border shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                   {icon}
                            </div>
                            {href && (
                                   <div className="opacity-0 group-hover:opacity-100 transition-all">
                                          <ArrowRight className="w-4 h-4" />
                                   </div>
                            )}
                     </div>

                     <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                            <h4 className="text-3xl font-semibold tracking-tight text-foreground">{value}</h4>
                     </div>
              </Card>
       );

       return href ? <Link href={href} className="block">{Content}</Link> : Content;
}

function QuickActionCard({ title, subtitle, icon, href, color }: any) {
       const colors: any = {
              blue: "hover:bg-blue-500/5 hover:border-blue-500/20",
              sky: "hover:bg-sky-500/5 hover:border-sky-500/20",
              rose: "hover:bg-rose-500/5 hover:border-rose-500/20",
              emerald: "hover:bg-emerald-500/5 hover:border-emerald-500/20",
       }

       return (
              <Link href={href} className="group block">
                     <Card className={cn(
                            "p-6 rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-md",
                            colors[color]
                     )}>
                            <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl border border-border bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 flex-shrink-0">
                                          {icon}
                                   </div>
                                   <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-lg tracking-tight text-foreground">{title}</h4>
                                          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                                   </div>
                                   <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                            </div>
                     </Card>
              </Link>
       );
}
