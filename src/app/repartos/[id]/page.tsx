import { prisma } from "@/lib/prisma";
import { Truck, MapPin, ChevronLeft, Package, CheckCircle, Clock, MessageCircle, Phone, ExternalLink, Navigation, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import OrderDeliveryActions from "@/components/delivery/OrderDeliveryActions";
import DeliveryRouteMode from "@/components/delivery/DeliveryRouteMode";
import DeliveryRoutePrintModal from "@/components/delivery/DeliveryRoutePrintModal";
import { DeliveryStop } from "@/types/delivery";

export default async function DeliveryDetailPage({ params, searchParams }: {
       params: Promise<{ id: string }>;
       searchParams: Promise<{ modo?: string }>;
}) {
       const { id } = await params;
       const resolvedSearch = await searchParams;
       const deliveryId = parseInt(id);
       const isModoRepartidor = resolvedSearch.modo === "repartidor";

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

       // Prepare stops for route mode
       const stops: DeliveryStop[] = delivery.orders.map((order: any) => ({
              orderId: order.id,
              clientId: order.clientId,
              clientName: order.client.name,
              clientAddress: order.client.address,
              clientPhone: order.client.phone,
              clientBalance: order.client.balance,
              items: order.items.map((item: any) => ({ name: item.product.name, qty: item.quantity })),
              totalAmount: order.totalAmount,
              status: order.status === "DELIVERED" ? "delivered" : "pending",
       }));

       // ─── MODO REPARTIDOR ─────────────────────────────────────────────────
       if (isModoRepartidor) {
              return (
                     <div className="page-container text-white">
                            <div className="flex items-center justify-between mb-6">
                                   <Link href={`/repartos/${deliveryId}`}>
                                          <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                                                 <ChevronLeft className="w-4 h-4" /> Salir del Modo
                                          </button>
                                   </Link>
                                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">
                                          <Navigation className="w-3 h-3" />
                                          Modo Repartidor
                                   </div>
                            </div>
                            <DeliveryRouteMode delivery={delivery} stops={stops} />
                     </div>
              );
       }

       // ─── VISTA ADMIN NORMAL ───────────────────────────────────────────────
       return (
              <div className="page-container space-y-8 text-white">

                     {/* Header */}
                     <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                   <Link href="/repartos">
                                          <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                                 <ChevronLeft className="w-4 h-4" />
                                          </button>
                                   </Link>
                                   <div>
                                          <div className="flex items-center gap-3">
                                                 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reparto #{delivery.id}</h1>
                                                 <div className={cn(
                                                        "px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                                        deliveredCount === totalCount && totalCount > 0
                                                               ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                                               : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                                 )}>
                                                        {deliveredCount === totalCount && totalCount > 0 ? "✓ Completado" : "En Curso"}
                                                 </div>
                                          </div>
                                          <p className="text-sm text-white/40 font-medium mt-1">
                                                 {deliveredCount} de {totalCount} entregados
                                          </p>
                                   </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                   <DeliveryRoutePrintModal delivery={delivery} orders={delivery.orders} />
                                   <Link href={`/repartos/${deliveryId}?modo=repartidor`} className="flex-1 sm:flex-initial">
                                          <button className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                                                 <Navigation className="w-4 h-4" />
                                                 Modo Repartidor
                                          </button>
                                   </Link>
                            </div>
                     </header>

                     {/* Progress Bar */}
                     <div className="space-y-2">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/30">
                                   <span>Progreso del reparto</span>
                                   <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                   <div
                                          className={cn(
                                                 "h-full rounded-full transition-all duration-700",
                                                 progress === 100 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-primary to-accent"
                                          )}
                                          style={{ width: `${progress}%` }}
                                   />
                            </div>
                     </div>

                     {/* Orders List */}
                     <div className="space-y-4">
                            {delivery.orders.map((order: any, idx: number) => (
                                   <OrderCard key={order.id} order={order} index={idx} />
                            ))}
                     </div>
              </div>
       );
}

function OrderCard({ order, index }: { order: any; index: number }) {
       const isDelivered = order.status === "DELIVERED";

       return (
              <div className={cn(
                     "border rounded-2xl sm:rounded-[2rem] overflow-hidden transition-all duration-300",
                     isDelivered
                            ? "bg-emerald-500/5 border-emerald-500/10 opacity-75"
                            : "bg-white/[0.02] border-white/10 hover:border-white/20"
              )}>
                     <div className="p-5 sm:p-7">
                            {/* Top row */}
                            <div className="flex items-start justify-between mb-4">
                                   <div>
                                          <div className="flex items-center gap-2 mb-1">
                                                 <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Pedido #{order.id}</span>
                                                 {isDelivered && (
                                                        <span className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                                                               <CheckCircle className="w-3 h-3" /> entregado
                                                        </span>
                                                 )}
                                          </div>
                                          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">{order.client.name}</h2>
                                   </div>
                                   <div className="text-xl sm:text-2xl font-black tracking-tighter text-white tabular-nums shrink-0">
                                          ${order.totalAmount.toLocaleString()}
                                   </div>
                            </div>

                            {/* Address + Contact */}
                            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                   <a
                                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.client.address)}`}
                                          target="_blank"
                                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-primary hover:border-primary/20 transition-all text-xs font-bold flex-1"
                                   >
                                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                          <span className="truncate">{order.client.address}</span>
                                          <ExternalLink className="w-3 h-3 shrink-0 ml-auto" />
                                   </a>

                                   {order.client.phone && (
                                          <div className="flex gap-2">
                                                 <a href={`tel:${order.client.phone}`}
                                                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all text-xs font-bold">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        <span className="sm:hidden">Llamar</span>
                                                 </a>
                                                 <a href={`https://wa.me/${order.client.phone?.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 h-9 px-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-all text-xs font-bold">
                                                        <MessageCircle className="w-3.5 h-3.5" />
                                                        <span className="sm:hidden">WhatsApp</span>
                                                 </a>
                                          </div>
                                   )}
                            </div>

                            {/* Items */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                   {order.items.map((item: any) => (
                                          <div key={item.id} className="flex items-center gap-1 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/50">
                                                 <Package className="w-3 h-3 text-primary" />
                                                 {item.quantity}× {item.product.name}
                                          </div>
                                   ))}
                            </div>

                            {/* Debt indicator */}
                            {order.client.balance > 0 && (
                                   <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/5 border border-rose-500/10 mb-4">
                                          <span className="text-[9px] font-black uppercase tracking-widest text-rose-400/60">Deuda pendiente:</span>
                                          <span className="text-sm font-black text-rose-400 tabular-nums">${order.client.balance.toLocaleString()}</span>
                                   </div>
                            )}

                            {/* Actions */}
                            {!isDelivered && (
                                   <div className="pt-4 border-t border-white/5">
                                          <OrderDeliveryActions order={order} />
                                   </div>
                            )}
                     </div>
              </div>
       );
}
