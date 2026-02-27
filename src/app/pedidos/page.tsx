import { prisma } from "@/lib/prisma";
import { ShoppingBag, Clock, Package, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import OrderList from "@/components/orders/OrderList";
import NewOrderButton from "@/components/orders/NewOrderButton";

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
              <div className="space-y-12 animate-fade-in-up">
                     {/* Header */}
                     <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="space-y-2">
                                   <div className="flex items-center gap-3 mb-2">
                                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                 <ShoppingBag className="w-5 h-5" />
                                          </div>
                                          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
                                   </div>
                                   <p className="text-muted-foreground font-medium">
                                          Gestión integral de ventas, seguimiento de estados y logística de envíos.
                                   </p>
                            </div>
                            <NewOrderButton />
                     </header>

                     {/* Stats Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <StatCard label="Pendientes" value={stats.pending.toString()} icon={<Clock className="w-4 h-4" />} color="amber" />
                            <StatCard label="Entregados" value={stats.delivered.toString()} icon={<Package className="w-4 h-4" />} color="emerald" />
                            <StatCard label="Pedidos Hoy" value={stats.totalToday.toString()} icon={<Calendar className="w-4 h-4" />} color="primary" />
                     </div>

                     {/* Main List */}
                     <section className="pt-8 border-t border-border">
                            <OrderList initialOrders={orders} />
                     </section>
              </div>
       );
}

function StatCard({ label, value, icon, color }: any) {
       const colors: any = {
              amber: "text-amber-600 bg-amber-500/5 border-amber-500/10",
              emerald: "text-emerald-600 bg-emerald-500/5 border-emerald-500/10",
              primary: "text-primary bg-primary/5 border-primary/10"
       }
       const colorClass = colors[color] || colors.primary;

       return (
              <Card className="bg-card border-border shadow-sm flex items-center p-6 gap-4 rounded-2xl">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass} border`}>
                            {icon}
                     </div>
                     <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                            <h4 className="text-2xl font-bold tracking-tight">{value}</h4>
                     </div>
              </Card>
       )
}
