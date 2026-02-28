"use strict";
"use client";

import { useState } from "react";
import { Search, MapPin, User, ChevronRight, Package, Trash2, XCircle, Clock, CheckCircle2, MoreHorizontal, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteOrder, cancelOrder } from "@/actions/orders";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderList({ initialOrders }: { initialOrders: any[] }) {
       const [search, setSearch] = useState("");

       const filtered = initialOrders.filter(o =>
              o.client.name.toLowerCase().includes(search.toLowerCase()) ||
              o.id.toString().includes(search)
       );

       const handleDelete = async (id: number) => {
              if (!confirm("¿Deseas eliminar este pedido definitivamente?")) return;
              const result = await deleteOrder(id);
              if (result.success) toast.success("Pedido eliminado del registro");
              else toast.error("Error: " + result.error);
       };

       const handleCancel = async (id: number) => {
              if (!confirm("¿Deseas cancelar este pedido?")) return;
              const result = await cancelOrder(id);
              if (result.success) toast.success("Pedido cancelado exitosamente");
              else toast.error("Error: " + result.error);
       };

       return (
              <div className="space-y-12">
                     {/* RADICAL SEARCH BAR */}
                     <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                            <div className="relative group w-full max-w-xl">
                                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-white transition-colors" />
                                   <input
                                          type="text"
                                          placeholder="Filtro de búsqueda por cliente o ID..."
                                          value={search}
                                          onChange={(e) => setSearch(e.target.value)}
                                          className="w-full h-20 bg-neutral-900/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] pl-16 pr-8 font-bold text-xl text-white focus:outline-none focus:ring-4 focus:ring-white/5 transition-all placeholder:text-white/10"
                                   />
                            </div>
                            <div className="flex gap-4">
                                   <div className="px-6 py-4 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center gap-3">
                                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mostrando {filtered.length} Pedidos</span>
                                   </div>
                            </div>
                     </div>

                     {/* ORDERS GRID / LIST */}
                     <div className="grid grid-cols-1 gap-6">
                            <AnimatePresence mode="popLayout">
                                   {filtered.length === 0 ? (
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 className="py-32 text-center rounded-[4rem] bg-neutral-900/20 border border-dashed border-white/10"
                                          >
                                                 <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-white/5" />
                                                 <p className="font-black uppercase tracking-[0.3em] text-white/20">No se detectaron registros para "{search}"</p>
                                          </motion.div>
                                   ) : (
                                          filtered.map((order, idx) => (
                                                 <motion.div
                                                        key={order.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ duration: 0.4, delay: idx * 0.03 }}
                                                        className="group relative"
                                                 >
                                                        {/* Main Card */}
                                                        <div className="bg-neutral-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-10 flex flex-col lg:flex-row justify-between items-center gap-10 hover:border-white/15 transition-all duration-500 hover:shadow-[0_0_80px_rgba(0,0,0,0.5)]">

                                                               <div className="flex items-center gap-10 w-full lg:w-auto">
                                                                      {/* Status Icon Decoration */}
                                                                      <div className={cn(
                                                                             "w-24 h-24 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-2xl relative transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105",
                                                                             order.status === "DELIVERED" ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                                                                                    order.status === "CANCELLED" ? "bg-neutral-800 text-white shadow-black/40" : "bg-amber-500 text-white shadow-amber-500/20"
                                                                      )}>
                                                                             {order.status === "DELIVERED" ? <CheckCircle2 className="w-10 h-10" /> :
                                                                                    order.status === "CANCELLED" ? <XCircle className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
                                                                      </div>

                                                                      <div className="min-w-0 space-y-3">
                                                                             <div className="flex items-center gap-4">
                                                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Ref. #{order.id}</span>
                                                                                    <div className={cn(
                                                                                           "h-1.5 w-1.5 rounded-full",
                                                                                           order.status === "DELIVERED" ? "bg-emerald-500" : "bg-amber-500"
                                                                                    )} />
                                                                                    <span className={cn(
                                                                                           "text-[10px] font-black uppercase tracking-[0.2em]",
                                                                                           order.status === "DELIVERED" ? "text-emerald-500" :
                                                                                                  order.status === "CANCELLED" ? "text-white/20" : "text-amber-500"
                                                                                    )}>
                                                                                           {order.status === "DELIVERED" ? "Entregado" :
                                                                                                  order.status === "CANCELLED" ? "Cancelado" : "Pendiente"}
                                                                                    </span>
                                                                             </div>
                                                                             <h3 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none group-hover:translate-x-2 transition-transform duration-500">
                                                                                    {order.client.name}
                                                                             </h3>
                                                                             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                                                                                    <MapPin className="w-4 h-4 text-primary" />
                                                                                    <span className="truncate">{order.client.address}</span>
                                                                             </div>
                                                                      </div>
                                                               </div>

                                                               {/* Items Pipeline View */}
                                                               <div className="hidden 2xl:flex items-center gap-8 px-12 border-x border-white/5 h-20">
                                                                      {order.items.slice(0, 4).map((item: any) => (
                                                                             <div key={item.id} className="flex items-center gap-3">
                                                                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-xs text-white">
                                                                                           {item.quantity}
                                                                                    </div>
                                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.product.name}</span>
                                                                             </div>
                                                                      ))}
                                                                      {order.items.length > 4 && (
                                                                             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black text-white/20">
                                                                                    +{order.items.length - 4}
                                                                             </div>
                                                                      )}
                                                               </div>

                                                               <div className="flex flex-col sm:flex-row items-center gap-12 w-full lg:w-auto">
                                                                      <div className="text-center sm:text-right w-full sm:w-auto">
                                                                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">Presupuesto Final</p>
                                                                             <div className="text-5xl font-black tracking-tighter text-white tabular-nums">
                                                                                    <span className="text-xl text-white/20 mr-1">$</span>
                                                                                    {order.totalAmount.toLocaleString()}
                                                                             </div>
                                                                      </div>

                                                                      <div className="flex gap-4 w-full sm:w-auto">
                                                                             {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                                                                                    <>
                                                                                           <button
                                                                                                  onClick={() => handleCancel(order.id)}
                                                                                                  className="h-16 w-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 transition-all active:scale-90"
                                                                                                  title="Cancelar Operación"
                                                                                           >
                                                                                                  <XCircle className="w-7 h-7" />
                                                                                           </button>
                                                                                           <button
                                                                                                  onClick={() => handleDelete(order.id)}
                                                                                                  className="h-16 w-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 transition-all active:scale-90"
                                                                                                  title="Eliminar Registro"
                                                                                           >
                                                                                                  <Trash2 className="w-7 h-7" />
                                                                                           </button>
                                                                                    </>
                                                                             )}
                                                                             <Button
                                                                                    variant="premium"
                                                                                    className="flex-1 sm:flex-none h-16 px-10 rounded-2xl group relative overflow-hidden"
                                                                             >
                                                                                    <span className="relative z-10 flex items-center gap-3">
                                                                                           VER DETALLE
                                                                                           <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                                                                    </span>
                                                                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                                                                             </Button>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </motion.div>
                                          ))
                                   )}
                            </AnimatePresence>
                     </div>
              </div>
       );
}
