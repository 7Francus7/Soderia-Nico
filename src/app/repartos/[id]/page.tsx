import { prisma } from "@/lib/prisma";
import { Truck, MapPin, ChevronLeft, Package, User, CheckCircle, Clock, MessageCircle, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import OrderDeliveryActions from "@/components/OrderDeliveryActions";

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
                     <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                            <h1 className="text-2xl font-black mb-4">Reparto no encontrado</h1>
                            <Link href="/repartos">
                                   <Button variant="premium">Volver a Repartos</Button>
                            </Link>
                     </div>
              );
       }

       const deliveredCount = delivery.orders.filter((o: any) => o.status === "DELIVERED").length;
       const totalCount = delivery.orders.length;
       const progress = totalCount > 0 ? (deliveredCount / totalCount) * 100 : 0;

       return (
              <div className="min-h-screen bg-background pb-20">
                     {/* Background Blobs */}
                     <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                     {/* Header Sticky */}
                     <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 p-4 sm:p-6 transition-all">
                            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                                   <div className="flex items-center gap-4">
                                          <Link href="/repartos">
                                                 <Button variant="ghost" size="icon" className="rounded-2xl bg-white/5">
                                                        <ChevronLeft className="w-6 h-6" />
                                                 </Button>
                                          </Link>
                                          <div>
                                                 <h1 className="text-xl sm:text-2xl font-black tracking-tight">Hoja de Ruta #{delivery.id}</h1>
                                                 <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                        {deliveredCount} de {totalCount} completados
                                                 </p>
                                          </div>
                                   </div>

                                   <div className="hidden sm:block w-32">
                                          <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden">
                                                 <div
                                                        className="h-full bg-primary transition-all duration-500"
                                                        style={{ width: `${progress}%` }}
                                                 />
                                          </div>
                                   </div>
                            </div>
                     </header>

                     <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 relative z-10">
                            {delivery.orders.map((order: any, index: number) => (
                                   <div
                                          key={order.id}
                                          className={cn(
                                                 "relative overflow-hidden rounded-[2.5rem] border transition-all",
                                                 order.status === "DELIVERED"
                                                        ? "bg-emerald-500/5 border-emerald-500/10 opacity-70"
                                                        : "bg-card border-white/10 shadow-xl"
                                          )}
                                   >
                                          {/* Order Header */}
                                          <div className="p-8 pb-4">
                                                 <div className="flex justify-between items-start mb-6">
                                                        <div className="space-y-1">
                                                               <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Pedido #{order.id}</span>
                                                               <h2 className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors">
                                                                      {order.client.name}
                                                               </h2>
                                                        </div>

                                                        {order.status === "DELIVERED" ? (
                                                               <div className="bg-emerald-500 text-white p-2 rounded-2xl shadow-lg shadow-emerald-500/20">
                                                                      <CheckCircle className="w-6 h-6" />
                                                               </div>
                                                        ) : (
                                                               <div className="bg-primary/20 text-primary p-3 rounded-2xl">
                                                                      <Clock className="w-6 h-6" />
                                                               </div>
                                                        )}
                                                 </div>

                                                 <div className="space-y-3">
                                                        <div className="flex items-center justify-between gap-3 text-lg font-bold text-foreground/80">
                                                               <a
                                                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.client.address)}`}
                                                                      target="_blank"
                                                                      className="flex items-center gap-3 hover:text-primary transition-colors group/address shrink min-w-0"
                                                               >
                                                                      <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center shrink-0 group-hover/address:bg-primary/20 group-hover/address:text-primary transition-all">
                                                                             <MapPin className="w-5 h-5" />
                                                                      </div>
                                                                      <div className="flex flex-col min-w-0">
                                                                             <span className="leading-tight truncate">{order.client.address}</span>
                                                                             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 group-hover/address:opacity-100 flex items-center gap-1">
                                                                                    Abrir GPS <ExternalLink className="w-2.5 h-2.5" />
                                                                             </span>
                                                                      </div>
                                                               </a>
                                                               <div className="flex gap-2 shrink-0">
                                                                      <a
                                                                             href={`https://wa.me/${order.client.phone?.replace(/[^0-9]/g, '')}`}
                                                                             target="_blank"
                                                                             className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 active:scale-95 transition-all"
                                                                      >
                                                                             <MessageCircle className="w-5 h-5" />
                                                                      </a>
                                                                      <a
                                                                             href={`tel:${order.client.phone}`}
                                                                             className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 active:scale-95 transition-all"
                                                                      >
                                                                             <Phone className="w-5 h-5" />
                                                                      </a>
                                                               </div>
                                                        </div>
                                                        {order.client.phone && (
                                                               <div className="flex items-center gap-3 text-lg font-bold text-foreground/80">
                                                                      <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center shrink-0">
                                                                             <User className="w-5 h-5" />
                                                                      </div>
                                                                      {order.client.phone}
                                                               </div>
                                                        )}
                                                 </div>
                                          </div>

                                          {/* Order Items Summary */}
                                          <div className="px-8 py-4 bg-muted/5 border-y border-white/5">
                                                 <div className="flex flex-wrap gap-2">
                                                        {order.items.map((item: any) => (
                                                               <div key={item.id} className="bg-card border border-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                                                                      <Package className="w-3.5 h-3.5 text-primary" />
                                                                      <span>{item.quantity}x</span>
                                                                      <span className="text-muted-foreground">{item.product.name}</span>
                                                               </div>
                                                        ))}
                                                 </div>
                                          </div>

                                          {/* Actions Area - The BIG Buttons */}
                                          <div className="p-8 flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/5">
                                                 <div className="text-3xl font-black">
                                                        ${order.totalAmount.toLocaleString()}
                                                 </div>

                                                 <OrderDeliveryActions order={order} />
                                          </div>
                                   </div>
                            ))}
                     </main>

                     {/* Bottom Floating Progress Bar for Mobile */}
                     <div className="fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-xl border-t border-white/5 sm:hidden z-[100]">
                            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                                   <div className="flex-1 h-3 bg-muted/20 rounded-full overflow-hidden">
                                          <div
                                                 className="h-full bg-primary shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all duration-700"
                                                 style={{ width: `${progress}%` }}
                                          />
                                   </div>
                                   <span className="text-sm font-black italic">
                                          {Math.round(progress)}%
                                   </span>
                            </div>
                     </div>
              </div>
       );
}
