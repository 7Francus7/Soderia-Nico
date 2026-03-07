"use strict";
"use client";

import { useState } from "react";
import { Search, MapPin, XCircle, Clock, CheckCircle2, ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
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
              <div className="space-y-5">
                     {/* Search + count */}
                     <div className="flex items-center gap-3">
                            <div className="relative group flex-1">
                                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                                   <input
                                          type="text"
                                          placeholder="Buscar por cliente o ID..."
                                          value={search}
                                          onChange={(e) => setSearch(e.target.value)}
                                          className="w-full h-12 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-2xl pl-11 pr-4 font-bold text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all placeholder:text-white/15"
                                   />
                            </div>
                            <div className="px-3 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2 shrink-0">
                                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                   <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40">{filtered.length}</span>
                            </div>
                     </div>

                     {/* Orders */}
                     <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                   {filtered.length === 0 ? (
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 className="py-20 text-center rounded-[2rem] bg-neutral-900/20 border border-dashed border-white/10"
                                          >
                                                 <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-white/5" />
                                                 <p className="font-black uppercase tracking-[0.25em] text-white/20 text-sm">Sin resultados</p>
                                          </motion.div>
                                   ) : (
                                          filtered.map((order, idx) => (
                                                 <motion.div
                                                        key={order.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 12 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ duration: 0.3, delay: idx * 0.025 }}
                                                 >
                                                        <OrderCard
                                                               order={order}
                                                               onCancel={handleCancel}
                                                               onDelete={handleDelete}
                                                        />
                                                 </motion.div>
                                          ))
                                   )}
                            </AnimatePresence>
                     </div>
              </div>
       );
}

function OrderCard({ order, onCancel, onDelete }: { order: any; onCancel: (id: number) => void; onDelete: (id: number) => void }) {
       const statusConfig = {
              DELIVERED: { label: "Entregado", color: "bg-emerald-500 shadow-emerald-500/20", textColor: "text-emerald-500", icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> },
              CANCELLED: { label: "Cancelado", color: "bg-neutral-700 shadow-black/40", textColor: "text-white/20", icon: <XCircle className="w-5 h-5 sm:w-6 sm:h-6" /> },
              CONFIRMED: { label: "Pendiente", color: "bg-amber-500 shadow-amber-500/20", textColor: "text-amber-500", icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" /> },
       };
       const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.CONFIRMED;
       const isPending = order.status !== "DELIVERED" && order.status !== "CANCELLED";

       return (
              <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-[1.75rem] sm:rounded-[2.5rem] p-4 sm:p-6 lg:p-8 hover:border-white/10 transition-all duration-300 group">

                     {/* Mobile Layout: stacked */}
                     <div className="flex items-start gap-4">
                            {/* Status Icon */}
                            <div className={cn(
                                   "w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-xl text-white transition-transform duration-300 group-hover:-rotate-3",
                                   status.color
                            )}>
                                   {status.icon}
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 min-w-0">
                                   {/* Top row: ref + status badge */}
                                   <div className="flex items-center gap-2 mb-1">
                                          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20">#{order.id}</span>
                                          <div className={cn("h-1 w-1 rounded-full", status.color.split(' ')[0])} />
                                          <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", status.textColor)}>
                                                 {status.label}
                                          </span>
                                   </div>

                                   {/* Client name */}
                                   <h3 className="text-lg sm:text-2xl font-black tracking-tighter text-white uppercase italic leading-tight truncate group-hover:translate-x-1 transition-transform duration-300">
                                          {order.client.name}
                                   </h3>

                                   {/* Address */}
                                   <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-white/30 mt-1">
                                          <MapPin className="w-3 h-3 text-primary shrink-0" />
                                          <span className="truncate">{order.client.address}</span>
                                   </div>

                                   {/* Items preview (sm+) */}
                                   {order.items.length > 0 && (
                                          <div className="hidden sm:flex items-center gap-2 mt-2 flex-wrap">
                                                 {order.items.slice(0, 3).map((item: any) => (
                                                        <div key={item.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                                                               <span className="text-[9px] font-black text-white">{item.quantity}×</span>
                                                               <span className="text-[9px] font-black uppercase tracking-wide text-white/40">{item.product.name}</span>
                                                        </div>
                                                 ))}
                                                 {order.items.length > 3 && (
                                                        <span className="text-[9px] font-black text-white/20">+{order.items.length - 3}</span>
                                                 )}
                                          </div>
                                   )}
                            </div>

                            {/* Amount */}
                            <div className="text-right shrink-0">
                                   <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-0.5">Total</p>
                                   <div className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tighter text-white tabular-nums">
                                          <span className="text-xs text-white/20">$</span>{order.totalAmount.toLocaleString()}
                                   </div>
                            </div>
                     </div>

                     {/* Action buttons */}
                     {isPending && (
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
                                   <button
                                          onClick={() => onCancel(order.id)}
                                          className="h-9 w-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all active:scale-90"
                                          title="Cancelar"
                                   >
                                          <XCircle className="w-4 h-4" />
                                   </button>
                                   <button
                                          onClick={() => onDelete(order.id)}
                                          className="h-9 w-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all active:scale-90"
                                          title="Eliminar"
                                   >
                                          <Trash2 className="w-4 h-4" />
                                   </button>
                                   <Button
                                          variant="premium"
                                          className="h-9 px-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
                                   >
                                          Ver <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                   </Button>
                            </div>
                     )}
              </div>
       );
}
