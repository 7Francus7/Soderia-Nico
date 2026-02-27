import { Truck, Users, CreditCard, Droplets, ArrowRight, Box, Banknote, ShoppingBag, ShieldCheck, TrendingUp, Calendar, MapPin } from "lucide-react";
// Forcing redeploy
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Card } from "@/components/ui/card";
import NewOrderButton from "@/components/NewOrderButton";

export default async function Home() {
       const session = await getServerSession();
       const [clientCount, orderCount, totalDebt, activeDeliveries] = await Promise.all([
              prisma.client.count(),
              prisma.order.count({ where: { status: "DELIVERED" } }),
              prisma.client.aggregate({ _sum: { balance: true } }),
              prisma.delivery.count({ where: { status: "IN_PROGRESS" } })
       ]);

       const userName = session?.user?.name || "Administrador";

       return (
              <div className="p-6 lg:p-10 space-y-10">

                     {/* Header / Welcome Section */}
                     <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-1">
                                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Sistema Operativo</span>
                                   </div>
                                   <h2 className="text-4xl lg:text-5xl font-black tracking-tighter">
                                          Hola, <span className="text-primary italic">{userName.split(' ')[0]}</span> 👋
                                   </h2>
                                   <p className="text-muted-foreground font-medium text-lg">
                                          Hoy es {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}.
                                   </p>
                            </div>

                            <div className="flex items-center gap-3">
                                   <NewOrderButton />
                            </div>
                     </header>

                     {/* Primary Metrics Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard
                                   label="Clientes Activos"
                                   value={clientCount.toString()}
                                   icon={<Users className="w-5 h-5" />}
                                   trend="+4 este mes"
                                   color="blue"
                            />
                            <MetricCard
                                   label="Entregas Finalizadas"
                                   value={orderCount.toString()}
                                   icon={<Truck className="w-5 h-5" />}
                                   trend="82% de efectividad"
                                   color="purple"
                            />
                            <MetricCard
                                   label="Deuda en Calle"
                                   value={`$${(totalDebt._sum.balance || 0).toLocaleString()}`}
                                   icon={<CreditCard className="w-5 h-5" />}
                                   trend="Acción requerida"
                                   color="rose"
                            />
                            <MetricCard
                                   label="Repartos en Curso"
                                   value={activeDeliveries.toString()}
                                   icon={<MapPin className="w-5 h-5" />}
                                   trend="Ver seguimiento"
                                   color="amber"
                                   href="/repartos"
                            />
                     </div>

                     {/* Analytics Section */}
                     <section className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                   <h3 className="text-xl font-black tracking-tight uppercase italic opacity-40 flex items-center gap-2">
                                          <TrendingUp className="w-5 h-5" /> Estadísticas Vitales
                                   </h3>
                            </div>
                            <AnalyticsDashboard />
                     </section>

                     {/* Quick Access Grid */}
                     <section className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                   <h3 className="text-xl font-black tracking-tight uppercase italic opacity-40">Módulos de Gestión</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                   <QuickActionCard
                                          title="Repartos"
                                          icon={<Truck className="w-6 h-6" />}
                                          href="/repartos"
                                          bgColor="bg-indigo-500"
                                   />
                                   <QuickActionCard
                                          title="Clientes"
                                          icon={<Users className="w-6 h-6" />}
                                          href="/clientes"
                                          bgColor="bg-blue-500"
                                   />
                                   <QuickActionCard
                                          title="Cuentas"
                                          icon={<CreditCard className="w-6 h-6" />}
                                          href="/cuentas"
                                          bgColor="bg-rose-500"
                                   />
                                   <QuickActionCard
                                          title="Caja"
                                          icon={<Banknote className="w-6 h-6" />}
                                          href="/caja"
                                          bgColor="bg-emerald-500"
                                   />
                                   <QuickActionCard
                                          title="Pedidos"
                                          icon={<ShoppingBag className="w-6 h-6" />}
                                          href="/pedidos"
                                          bgColor="bg-amber-500"
                                   />
                                   <QuickActionCard
                                          title="Productos"
                                          icon={<Box className="w-6 h-6" />}
                                          href="/productos"
                                          bgColor="bg-violet-500"
                                   />
                                   <QuickActionCard
                                          title="Control Personal"
                                          icon={<ShieldCheck className="w-6 h-6" />}
                                          href="/usuarios"
                                          bgColor="bg-slate-700"
                                   />
                            </div>
                     </section>
              </div>
       );
}

function MetricCard({ label, value, icon, trend, color, href }: any) {
       const colors: any = {
              blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
              purple: "text-primary bg-primary/10 border-primary/20",
              rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
              amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
       };

       const Content = (
              <div className={`p-8 rounded-[2rem] border glass-card hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-center`}>
                     <div className={`absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-700`}>
                            {icon}
                     </div>
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]}`}>
                            {icon}
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                     <h4 className="text-3xl font-black tracking-tighter">{value}</h4>
                     <p className="text-[10px] font-bold text-muted-foreground mt-2 italic group-hover:text-foreground transition-colors">{trend}</p>
              </div>
       );

       return href ? <Link href={href} className="block h-full">{Content}</Link> : Content;
}

function QuickActionCard({ title, icon, href, bgColor }: any) {
       return (
              <Link href={href} className="group h-full">
                     <Card className="h-full border-white/5 bg-card/30 hover:bg-card/60 rounded-[2rem] p-6 transition-all duration-300 flex items-center gap-4 hover:border-white/10 shadow-lg hover:shadow-primary/5">
                            <div className={`w-12 h-12 ${bgColor} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                                   {icon}
                            </div>
                            <div className="flex-1">
                                   <h4 className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">{title}</h4>
                                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Ver Módulo</p>
                            </div>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                     </Card>
              </Link>
       );
}
