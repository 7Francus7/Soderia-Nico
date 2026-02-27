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
              <div className="space-y-12 animate-fade-in-up">
                     {/* Header */}
                     <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="space-y-2">
                                   <div className="flex items-center gap-3 mb-2">
                                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                 <Truck className="w-5 h-5" />
                                          </div>
                                          <h1 className="text-3xl font-bold tracking-tight">Repartos</h1>
                                   </div>
                                   <p className="text-muted-foreground font-medium">
                                          Gestión dinámica de logística, hojas de ruta y control de choferes.
                                   </p>
                            </div>
                            <NewDeliveryButton
                                   pendingOrdersCount={availableOrders.length}
                                   availableOrders={availableOrders}
                            />
                     </header>

                     {/* Delivery List Area */}
                     <section className="pt-8 border-t border-border">
                            <DeliveryList initialDeliveries={processedDeliveries} />
                     </section>
              </div>
       );
}
