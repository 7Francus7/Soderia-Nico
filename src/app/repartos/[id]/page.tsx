import { prisma } from "@/lib/prisma";
import { Truck, MapPin, ChevronLeft, Package, CheckCircle, Clock, MessageCircle, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import OrderDeliveryActions from "@/components/delivery/OrderDeliveryActions";

export default async function DeliveryDetailPage({ params }: { params: { id: string } }) {
       const deliveryId = parseInt(params.id);

       const delivery = await prisma.delivery.findUnique({
              where: { id: deliveryId },
              include: {
                     orders: {
                            include: {
                                   client: true,
                                   items: {
                                          include: { product: true }
                                   }
                            },
                            orderBy: { id: "asc" }
                     }
              }
       });

       if (!delivery) {
              return (
                     <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                            <h1 className="text-2xl font-bold mb-4">Reparto no encontrado</h1>
                            <Link href="/repartos">
                                   <Button variant="outline">Volver a Repartos</Button>
                            </Link>
                     </div>
              );
       }

       const deliveredCount = delivery.orders.filter((o: any) => o.status === "DELIVERED").length;
       const totalCount = delivery.orders.length;
       const progress = totalCount > 0 ? (deliveredCount / totalCount) * 100 : 0;

       return (
              <div className="space-y-12 animate-fade-in-up pb-24">
                     {/* Sticky Progress Header */}
                     <header className="sticky top-0 z-[40] -mx-4 lg:-mx-12 px-4 lg:px-12 py-6 bg-background/80 backdrop-blur-md border-b border-border transition-all">
                            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                                   <div className="flex items-center gap-5">
                                          <Link href="/repartos">
                                                 <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-border">
                                                        <ChevronLeft className="w-5 h-5" />
                                                 </Button>
                                          </Link>
                                          <div>
                                                 <h1 className="text-lg font-bold tracking-tight">Hoja #{delivery.id}</h1>
                                                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                        {deliveredCount} de {totalCount} completados
                                                 </p>
                                          </div>
                                   </div>

                                   <div className="flex-1 max-w-[200px] hidden sm:block">
                                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                 <div
                                                        className="h-full bg-primary transition-all duration-700 ease-in-out"
                                                        style={{ width: `${progress}%` }}
                                                 />
                                          </div>
                                   </div>
                            </div>
                     </header>

                     {/* Orders List */}
                     <main className="max-w-4xl mx-auto space-y-8">
                            {delivery.orders.map((order: any) => (
                                   <Card
                                          key={order.id}
                                          className={cn(
                                                 "overflow-hidden border transition-all duration-300 rounded-2xl",
                                                 order.status === "DELIVERED"
                                                        ? "bg-emerald-500/[0.02] border-emerald-500/10 opacity-80"
                                                        : "bg-card border-border shadow-sm hover:shadow-md"
                                          )}
                                   >
                                          <div className="p-8">
                                                 <div className="flex justify-between items-start mb-8">
                                                        <div className="space-y-1">
                                                               <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Pedido #{order.id}</span>
                                                               <h2 className="text-2xl font-bold tracking-tight">
                                                                      {order.client.name}
                                                               </h2>
                                                        </div>

                                                        {order.status === "DELIVERED" ? (
                                                               <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                                      <CheckCircle className="w-6 h-6" />
                                                               </div>
                                                        ) : (
                                                               <div className="p-2 rounded-xl bg-primary/5 text-primary border border-primary/10">
                                                                      <Clock className="w-6 h-6" />
                                                               </div>
                                                        )}
                                                 </div>

                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                                        <a
                                                               href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.client.address)}`}
                                                               target="_blank"
                                                               className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                                                        >
                                                               <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border group-hover:text-primary transition-colors">
                                                                      <MapPin className="w-5 h-5" />
                                                               </div>
                                                               <div className="space-y-0.5 min-w-0">
                                                                      <p className="text-sm font-semibold truncate leading-tight">{order.client.address}</p>
                                                                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary opacity-60 flex items-center gap-1">GPS <ExternalLink className="w-2.5 h-2.5" /></p>
                                                               </div>
                                                        </a>

                                                        <div className="flex gap-2">
                                                               <a
                                                                      href={`tel:${order.client.phone}`}
                                                                      className="flex-1 flex items-center justify-center h-12 rounded-xl bg-muted border border-border text-foreground/70 hover:text-primary transition-colors"
                                                               >
                                                                      <Phone className="w-5 h-5" />
                                                               </a>
                                                               <a
                                                                      href={`https://wa.me/${order.client.phone?.replace(/[^0-9]/g, '')}`}
                                                                      target="_blank"
                                                                      className="flex-1 flex items-center justify-center h-12 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                                                               >
                                                                      <MessageCircle className="w-5 h-5" />
                                                               </a>
                                                        </div>
                                                 </div>

                                                 {/* Items Summary */}
                                                 <div className="flex flex-wrap gap-2 mb-8 p-4 bg-muted/20 rounded-xl border border-border/50">
                                                        {order.items.map((item: any) => (
                                                               <div key={item.id} className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-bold flex items-center gap-2">
                                                                      <Package className="w-3.5 h-3.5 text-muted-foreground" />
                                                                      <span className="text-primary">{item.quantity}x</span>
                                                                      <span className="opacity-70">{item.product.name}</span>
                                                               </div>
                                                        ))}
                                                 </div>

                                                 {/* Actions */}
                                                 <div className="flex flex-col sm:flex-row gap-6 items-center justify-between pt-6 border-t border-border/60">
                                                        <div className="text-3xl font-bold tracking-tighter">
                                                               <span className="text-sm font-medium opacity-40 mr-1">$</span>
                                                               {order.totalAmount.toLocaleString()}
                                                        </div>
                                                        <OrderDeliveryActions order={order} />
                                                 </div>
                                          </div>
                                   </Card>
                            ))}
                     </main>

                     {/* Mobile Progress Dock */}
                     <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border sm:hidden z-[100]">
                            <div className="max-w-4xl mx-auto flex items-center gap-4">
                                   <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                          <div
                                                 className="h-full bg-primary transition-all duration-700"
                                                 style={{ width: `${progress}%` }}
                                          />
                                   </div>
                                   <span className="text-[10px] font-bold tabular-nums">
                                          {Math.round(progress)}%
                                   </span>
                            </div>
                     </div>
              </div>
       );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
       return <div className={cn("bg-card border-border border rounded-2xl", className)}>{children}</div>
}
