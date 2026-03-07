import { prisma } from "@/lib/prisma";
import { Truck, Activity, TrendingUp } from "lucide-react";
import DeliveryList from "@/components/delivery/DeliveryList";
import NewDeliveryButton from "@/components/delivery/NewDeliveryButton";

export default async function RepartosPage() {
       const deliveries = await prisma.delivery.findMany({
              include: {
                     _count: {
                            select: { orders: true }
                     },
                     orders: {
                            select: { status: true }
                     }
              },
              orderBy: { createdAt: "desc" }
       });

       const processedDeliveries = deliveries.map((d: any) => ({
              ...d,
              ordersCount: d._count.orders,
              deliveredCount: d.orders.filter((o: any) => o.status === "DELIVERED").length
       }));

       const availableOrders = await prisma.order.findMany({
              where: {
                     status: "CONFIRMED",
                     deliveryId: null
              },
              include: {
                     client: true
              }
       });

       return (
              <div className="flex flex-col min-h-screen bg-background text-foreground animate-fade-in pb-32">

                     {/* GOOGLE PROFESSIONAL HEADER AREA */}
                     <header className="px-6 pt-12 pb-10 sm:px-10 lg:px-16">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                   <div className="space-y-2">
                                          <div className="flex items-center gap-2 mb-1">
                                                 <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20 shrink-0">
                                                        <Truck className="w-4 h-4" />
                                                 </div>
                                                 <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Logística Activa</span>
                                          </div>
                                          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                                                 Hoja de Repartos
                                          </h1>
                                          <p className="text-sm font-medium text-muted-foreground max-w-2xl">
                                                 Administración dinámica de rutas, logística de choferes y estados de entrega.
                                          </p>
                                   </div>

                                   <div className="w-full sm:w-auto">
                                          <NewDeliveryButton
                                                 pendingOrdersCount={availableOrders.length}
                                                 availableOrders={availableOrders}
                                          />
                                   </div>
                            </div>
                     </header>

                     <main className="px-6 sm:px-10 lg:px-16 space-y-12">
                            {/* OVERVIEW SECTION */}
                            <section className="space-y-6">
                                   <div className="flex items-center justify-between px-1">
                                          <div className="flex items-center gap-3">
                                                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                                        <Activity className="w-5 h-5 stroke-[2px]" />
                                                 </div>
                                                 <div className="flex flex-col">
                                                        <h3 className="text-xl font-bold text-foreground tracking-tight">Pipeline de Logística</h3>
                                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Monitoreo de Rutas</p>
                                                 </div>
                                          </div>
                                          <div className="px-4 py-1.5 bg-secondary border border-border rounded-full flex items-center gap-2 shadow-sm">
                                                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{availableOrders.length} PEDIDOS SIN ASIGNAR</span>
                                          </div>
                                   </div>

                                   <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                          <DeliveryList initialDeliveries={processedDeliveries} />
                                   </div>
                            </section>
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
