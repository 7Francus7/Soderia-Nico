"use strict";
"use client";

import { useState } from "react";
import { Search, MapPin, User, ChevronRight, Package, Trash2, XCircle, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { deleteOrder, cancelOrder } from "@/actions/orders";
import { toast } from "sonner";

export default function OrderList({ initialOrders }: { initialOrders: any[] }) {
       const [search, setSearch] = useState("");

       const filtered = initialOrders.filter(o =>
              o.client.name.toLowerCase().includes(search.toLowerCase()) ||
              o.id.toString().includes(search)
       );

       const handleDelete = async (id: number) => {
              if (!confirm("¿Deseas eliminar este pedido?")) return;
              const result = await deleteOrder(id);
              if (result.success) toast.success("Pedido eliminado");
              else toast.error("Error: " + result.error);
       };

       const handleCancel = async (id: number) => {
              if (!confirm("¿Deseas cancelar este pedido?")) return;
              const result = await cancelOrder(id);
              if (result.success) toast.success("Pedido cancelado");
              else toast.error("Error: " + result.error);
       };

       return (
              <div className="space-y-6">
                     {/* Search */}
                     <div className="relative group max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                   type="text"
                                   placeholder="Buscar por cliente o N°..."
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                                   className="w-full bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl h-14 pl-12 pr-4 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xl"
                            />
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                            {filtered.length === 0 ? (
                                   <div className="py-20 text-center bg-card/40 border border-white/10 rounded-[2.5rem] glass-card opacity-50">
                                          No se encontraron pedidos.
                                   </div>
                            ) : (
                                   filtered.map((order, idx) => (
                                          <div
                                                 key={order.id}
                                                 className="bg-card border border-white/5 rounded-[2.5rem] p-6 sm:px-10 flex flex-col lg:flex-row justify-between items-center gap-6 hover:border-primary/20 transition-all animate-fade-in-up shadow-2xl shadow-black/5"
                                                 style={{ animationDelay: `${idx * 0.05}s` }}
                                          >
                                                 <div className="flex items-center gap-6 w-full lg:w-auto">
                                                        <div className={cn(
                                                               "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                                               order.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-500" :
                                                                      order.status === "CANCELLED" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                                                        )}>
                                                               {order.status === "DELIVERED" ? <CheckCircle2 className="w-8 h-8" /> :
                                                                      order.status === "CANCELLED" ? <XCircle className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                                                        </div>
                                                        <div className="min-w-0">
                                                               <div className="flex items-center gap-3 mb-1">
                                                                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Pedido #{order.id}</span>
                                                                      <span className={cn(
                                                                             "text-[8px] font-black px-2 py-0.5 rounded-full uppercase",
                                                                             order.status === "DELIVERED" ? "bg-emerald-500/20 text-emerald-500" :
                                                                                    order.status === "CANCELLED" ? "bg-rose-500/20 text-rose-500" : "bg-amber-500/20 text-amber-500"
                                                                      )}>
                                                                             {order.status}
                                                                      </span>
                                                               </div>
                                                               <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors truncate">
                                                                      {order.client.name}
                                                               </h3>
                                                               <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground mt-1">
                                                                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 opacity-40" /> {order.client.address}</span>
                                                               </div>
                                                        </div>
                                                 </div>

                                                 {/* Items Preview */}
                                                 <div className="hidden xl:flex gap-4 overflow-x-auto py-1">
                                                        {order.items.slice(0, 3).map((item: any) => (
                                                               <div key={item.id} className="bg-muted/10 px-4 py-2 rounded-xl border border-white/5 whitespace-nowrap">
                                                                      <span className="text-xs font-black text-primary mr-2">{item.quantity}x</span>
                                                                      <span className="text-xs font-bold">{item.product.name}</span>
                                                               </div>
                                                        ))}
                                                        {order.items.length > 3 && (
                                                               <div className="bg-muted/10 px-3 py-2 rounded-xl text-xs font-bold opacity-40">
                                                                      +{order.items.length - 3} más
                                                               </div>
                                                        )}
                                                 </div>

                                                 <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto">
                                                        <div className="text-center sm:text-right w-full sm:w-auto">
                                                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Pedido</p>
                                                               <div className="text-3xl font-black tracking-tighter">
                                                                      ${order.totalAmount.toLocaleString()}
                                                               </div>
                                                        </div>

                                                        <div className="flex gap-2 w-full sm:w-auto">
                                                               {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                                                                      <>
                                                                             <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    onClick={() => handleCancel(order.id)}
                                                                                    className="h-12 w-12 rounded-xl border border-white/10 hover:bg-rose-500/10 hover:text-rose-500"
                                                                                    title="Cancelar"
                                                                             >
                                                                                    <XCircle className="w-5 h-5" />
                                                                             </Button>
                                                                             <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    onClick={() => handleDelete(order.id)}
                                                                                    className="h-12 w-12 rounded-xl border border-white/10 hover:bg-rose-500/10 hover:text-rose-500"
                                                                                    title="Eliminar"
                                                                             >
                                                                                    <Trash2 className="w-5 h-5" />
                                                                             </Button>
                                                                      </>
                                                               )}
                                                               <Button variant="outline" className="flex-1 sm:flex-none h-12 px-6 rounded-xl border-white/10 glass-card font-black uppercase text-xs tracking-widest">
                                                                      DETALLES
                                                               </Button>
                                                        </div>
                                                 </div>
                                          </div>
                                   ))
                            )}
                     </div>
              </div>
       );
}
