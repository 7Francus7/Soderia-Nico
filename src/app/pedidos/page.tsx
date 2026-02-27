import { prisma } from "@/lib/prisma";
import { ShoppingBag, Search, Plus, Calendar, Clock, MapPin, User, ChevronRight, Package, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OrderList from "@/components/OrderList";
import NewOrderButton from "@/components/NewOrderButton";
import { cn } from "@/lib/utils";

export default async function PedidosPage() {
       const orders = await prisma.order.findMany({
              include: {
                     client: true,
                     items: {
                            include: { product: true }
                     }
              },
              orderBy: { createdAt: "desc" },
              take: 50
       });

       const stats = {
              pending: orders.filter((o: any) => o.status === "CONFIRMED").length,
              delivered: orders.filter((o: any) => o.status === "DELIVERED").length,
              totalToday: orders.filter((o: any) => {
                     const today = new Date();
                     today.setHours(0, 0, 0, 0);
                     return o.createdAt >= today;
              }).length
       };

       return (
              <div className="min-h-screen bg-background p-6 lg:p-10 pb-32">
                     <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[40vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                     <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                   <div className="space-y-1">
                                          <div className="flex items-center gap-3">
                                                 <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/10">
                                                        <ShoppingBag className="w-6 h-6" />
                                                 </div>
                                                 <h1 className="text-4xl font-black tracking-tight uppercase italic">Pedidos</h1>
                                          </div>
                                          <p className="text-muted-foreground font-medium text-lg">
                                                 Seguimiento de ventas y control de despachos.
                                          </p>
                                   </div>

                                   <div className="hidden md:block">
                                          <NewOrderButton />
                                   </div>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                   <Card className="bg-amber-500/5 border-amber-500/10 p-8 flex justify-between items-center group overflow-hidden relative">
                                          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                                 <Clock className="w-24 h-24 text-amber-500" />
                                          </div>
                                          <div className="relative z-10">
                                                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/60 mb-1">Pendientes de Entrega</p>
                                                 <h3 className="text-5xl font-black tracking-tighter text-amber-500">{stats.pending}</h3>
                                          </div>
                                   </Card>

                                   <Card className="bg-emerald-500/5 border-emerald-500/10 p-8 flex justify-between items-center group overflow-hidden relative">
                                          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                                 <Package className="w-24 h-24 text-emerald-500" />
                                          </div>
                                          <div className="relative z-10">
                                                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 mb-1">Entregados (Total)</p>
                                                 <h3 className="text-5xl font-black tracking-tighter text-emerald-500">{stats.delivered}</h3>
                                          </div>
                                   </Card>

                                   <Card className="bg-primary/5 border-primary/10 p-8 flex justify-between items-center group overflow-hidden relative">
                                          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                                 <Calendar className="w-24 h-24 text-primary" />
                                          </div>
                                          <div className="relative z-10">
                                                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">Pedidos de Hoy</p>
                                                 <h3 className="text-5xl font-black tracking-tighter text-primary">{stats.totalToday}</h3>
                                          </div>
                                   </Card>
                            </div>

                            {/* List Section */}
                            <OrderList initialOrders={orders} />
                     </div>

                     {/* Floating Mobile CTA */}
                     <div className="fixed bottom-8 left-6 right-6 z-[100] md:hidden">
                            <NewOrderButton />
                     </div>
              </div>
       );
}
