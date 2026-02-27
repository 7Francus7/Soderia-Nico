import { prisma } from "@/lib/prisma";
import { Truck, Plus, RefreshCw, Calendar, Clock, CheckCircle, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import DeliveryList from "@/components/DeliveryList";
import NewDeliveryButton from "@/components/NewDeliveryButton";

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

       const pendingOrders = availableOrders.length;

       return (
              <div className="min-h-screen bg-background p-6 lg:p-10">
                     {/* Background blobs */}
                     <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
                     <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

                     <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                   <div>
                                          <div className="flex items-center gap-3 mb-2">
                                                 <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                                        <Truck className="w-6 h-6" />
                                                 </div>
                                                 <h1 className="text-4xl font-black tracking-tight">Repartos</h1>
                                          </div>
                                          <p className="text-muted-foreground font-medium text-lg">
                                                 Control de hojas de ruta y logística de distribución.
                                          </p>
                                   </div>

                                   <div className="flex items-center gap-3 w-full md:w-auto">
                                          <Button variant="outline" size="icon" className="rounded-2xl border-white/10 glass-card">
                                                 <RefreshCw className="w-5 h-5" />
                                          </Button>
                                          <NewDeliveryButton
                                                 pendingOrdersCount={pendingOrders}
                                                 availableOrders={availableOrders}
                                          />
                                   </div>
                            </div>

                            {/* Deliveries List */}
                            <DeliveryList initialDeliveries={processedDeliveries} />
                     </div>
              </div>
       );
}
