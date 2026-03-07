import { prisma } from "@/lib/prisma";
import { Truck } from "lucide-react";
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
              <div className="page-container space-y-8 lg:space-y-12 text-white">
                     {/* Header */}
                     <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 pb-6 border-b border-white/5">
                            <div className="space-y-2">
                                   <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                 <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                                          </div>
                                          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Repartos</h1>
                                   </div>
                                   <p className="text-sm text-muted-foreground">
                                          Logística dinámica, hojas de ruta y control de choferes.
                                   </p>
                            </div>
                            <NewDeliveryButton
                                   pendingOrdersCount={availableOrders.length}
                                   availableOrders={availableOrders}
                            />
                     </header>

                     {/* Delivery List */}
                     <section className="pt-2">
                            <DeliveryList initialDeliveries={processedDeliveries} />
                     </section>
              </div>
       );
}
