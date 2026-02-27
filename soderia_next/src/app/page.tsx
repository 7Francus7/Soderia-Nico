import { Truck, Users, CreditCard, Droplets, ArrowRight, Box, Banknote, ShoppingBag, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default async function Home() {
       const session = await getServerSession();
       const [clientCount, orderCount, totalDebt] = await Promise.all([
              prisma.client.count(),
              prisma.order.count({ where: { status: "DELIVERED" } }),
              prisma.client.aggregate({ _sum: { balance: true } })
       ]);

       return (
              <div className="min-h-screen bg-background selection:bg-primary/30 pb-20">
                     {/* Dynamic Background */}
                     <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                     </div>

                     <header className="relative z-10 px-6 py-12 lg:py-20 flex flex-col items-center justify-center text-center space-y-8">
                            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
                                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                          <span className="text-xs font-black uppercase tracking-[0.3em] text-foreground/70 text-nowrap">Sistema Activo</span>
                                   </div>
                                   <div className="px-4 py-1.5 rounded-2xl bg-primary/10 border border-primary/20 text-[10px] font-black uppercase text-primary tracking-widest italic">
                                          {session?.user?.name || "ADMIN"}
                                   </div>
                            </div>

                            <div className="space-y-2">
                                   <h1 className="text-7xl lg:text-9xl font-black tracking-tighter animate-fade-in-up">
                                          Sodería <span className="text-primary italic">Nico</span>
                                   </h1>
                                   <div className="flex items-center justify-center gap-6 mt-4 opacity-50 font-black text-[10px] tracking-[0.3em] uppercase animate-fade-in">
                                          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> {clientCount} CLIENTES</div>
                                          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> {orderCount} ENTREGAS</div>
                                          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> ${totalDebt._sum.balance?.toLocaleString() || 0} DEUDA</div>
                                   </div>
                            </div>

                            <p className="max-w-2xl text-lg lg:text-xl text-muted-foreground font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                   Plataforma premium de gestión logística y comercial para la distribución de agua y soda.
                            </p>
                     </header>

                     <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                            <div className="w-full max-w-6xl mx-auto space-y-12">
                                   <AnalyticsDashboard />

                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                          <DashboardCard
                                                 title="Repartos"
                                                 desc="Gestión de hojas de ruta y entregas diarias."
                                                 icon={<Truck className="w-8 h-8" />}
                                                 delay="0.2s"
                                          />
                                          <DashboardCard
                                                 title="Clientes"
                                                 desc="Cartera de clientes, saldos y envases."
                                                 icon={<Users className="w-8 h-8" />}
                                                 delay="0.3s"
                                                 href="/clientes"
                                          />
                                          <DashboardCard
                                                 title="Cuentas"
                                                 desc="Estados de cuenta y cobranzas pendientes."
                                                 icon={<CreditCard className="w-8 h-8" />}
                                                 delay="0.4s"
                                                 href="/cuentas"
                                          />
                                          <DashboardCard
                                                 title="Caja"
                                                 desc="Control de movimientos diarios y arqueo."
                                                 icon={<Banknote className="w-8 h-8" />}
                                                 delay="0.5s"
                                                 href="/caja"
                                          />
                                          <DashboardCard
                                                 title="Pedidos"
                                                 desc="Gestión de ventas y toma de pedidos rápida."
                                                 icon={<ShoppingBag className="w-8 h-8" />}
                                                 delay="0.6s"
                                                 href="/pedidos"
                                          />
                                          <DashboardCard
                                                 title="Usuarios"
                                                 desc="Control de acceso y roles del personal."
                                                 icon={<ShieldCheck className="w-8 h-8" />}
                                                 delay="0.7s"
                                                 href="/usuarios"
                                          />
                                          <DashboardCard
                                                 title="Productos"
                                                 desc="Inventario y lista de precios oficial."
                                                 icon={<Box className="w-8 h-8" />}
                                                 delay="0.8s"
                                                 href="/productos"
                                          />
                                   </div>

                                   <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
                                          <Button size="lg" className="rounded-full px-12 h-16 text-lg font-black tracking-widest uppercase shadow-2xl">
                                                 Acceder al Sistema
                                          </Button>
                                   </div>
                            </div>
                     </main>
              </div>
       );
}

function DashboardCard({ title, desc, icon, delay, href }: { title: string, desc: string, icon: React.ReactNode, delay: string, href?: string }) {
       const CardContent = (
              <div
                     className="group relative p-8 border glass-card border-white/10 rounded-[2.5rem] transition-all hover:scale-[1.02] hover:bg-card/60 h-full"
                     style={{ animationDelay: delay }}
              >
                     <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-primary/10">
                            {icon}
                     </div>
                     <h3 className="text-2xl font-black mb-2 tracking-tight">{title}</h3>
                     <p className="text-muted-foreground font-medium">{desc}</p>

                     {href && (
                            <div className="absolute top-8 right-8 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                   <ArrowRight className="w-5 h-5" />
                            </div>
                     )}
              </div>
       );

       if (href) {
              return (
                     <Link href={href} className="block h-full">
                            {CardContent}
                     </Link>
              );
       }

       return CardContent;
}
