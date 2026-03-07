"use strict";
"use client";

import { useState } from "react";
import { Search, MapPin, XCircle, Clock, CheckCircle2, ArrowRight, ShoppingBag, Trash2, History, TrendingUp, Calendar, ChevronRight } from "lucide-react";
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
              if (result.success) toast.success("¡Pedido eliminado!", {
                     style: { borderRadius: '1rem', fontWeight: '800' }
              });
              else toast.error("Error: " + result.error, {
                     style: { borderRadius: '1rem', fontWeight: '800' }
              });
       };

       const handleCancel = async (id: number) => {
              if (!confirm("¿Deseas cancelar este pedido?")) return;
              const result = await cancelOrder(id);
              if (result.success) toast.success("¡Pedido cancelado!", {
                     style: { borderRadius: '1rem', fontWeight: '800' }
              });
              else toast.error("Error: " + result.error, {
                     style: { borderRadius: '1rem', fontWeight: '800' }
              });
       };

       return (
              <div className="space-y-10">
                     {/* iOS Style Search Bar */}
                     <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative group flex-1 w-full">
                                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 stroke-[3px] transition-colors group-focus-within:text-primary" />
                                   <input
                                          type="text"
                                          placeholder="Buscar pedidos por cliente o ID..."
                                          value={search}
                                          onChange={(e) => setSearch(e.target.value)}
                                          className="w-full h-18 bg-slate-50 border-2 border-slate-50 rounded-[2rem] pl-16 pr-8 text-base font-bold text-foreground focus:outline-none focus:border-primary/20 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner"
                                   />
                            </div>
                            <div className="h-18 px-8 rounded-[2rem] bg-slate-50 border-2 border-slate-100 flex items-center justify-center shrink-0 min-w-[120px] shadow-sm">
                                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{filtered.length} Totales</span>
                            </div>
                     </div>

                     {/* Orders List */}
                     <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                   {filtered.length === 0 ? (
                                          <motion.div
                                                 initial={{ opacity: 0, scale: 0.9 }}
                                                 animate={{ opacity: 1, scale: 1 }}
                                                 className="py-24 text-center bg-slate-50 border-2 border-dashed border-slate-100 rounded-[3rem] px-10"
                                          >
                                                 <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-slate-200" />
                                                 <p className="font-black text-slate-300 uppercase tracking-[0.2em] text-[11px]">No se encontraron pedidos activos</p>
                                          </motion.div>
                                   ) : (
                                          filtered.map((order, idx) => (
                                                 <motion.div
                                                        key={order.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 30 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.03, type: "spring", damping: 20 }}
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
              DELIVERED: {
                     label: "Entregado",
                     bg: "bg-emerald-50/50",
                     iconColor: "text-emerald-500",
                     borderColor: "border-emerald-100/50",
                     dot: "bg-emerald-500",
                     icon: <CheckCircle2 className="w-7 h-7 stroke-[3px]" />
              },
              CANCELLED: {
                     label: "Cancelado",
                     bg: "bg-slate-50/50",
                     iconColor: "text-slate-400",
                     borderColor: "border-slate-100/50",
                     dot: "bg-slate-300",
                     icon: <XCircle className="w-7 h-7 stroke-[3px]" />
              },
              CONFIRMED: {
                     label: "Pendiente",
                     bg: "bg-amber-50/50",
                     iconColor: "text-amber-500",
                     borderColor: "border-amber-100/50",
                     dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse",
                     icon: <Clock className="w-7 h-7 stroke-[3px]" />
              },
       };
       const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.CONFIRMED;
       const isPending = order.status !== "DELIVERED" && order.status !== "CANCELLED";

       return (
              <div className="group bg-white border-2 border-slate-50 rounded-[2.8rem] p-8 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 relative overflow-hidden flex flex-col sm:flex-row items-center gap-8">
                     {/* Left Status Area */}
                     <div className={cn(
                            "w-20 h-20 rounded-[1.8rem] flex items-center justify-center shrink-0 border transition-transform duration-500 group-hover:scale-110 shadow-sm",
                            status.bg, status.borderColor, status.iconColor
                     )}>
                            {status.icon}
                     </div>

                     {/* Content Center */}
                     <div className="flex-1 min-w-0 w-full">
                            <div className="flex items-center gap-3 mb-2 px-1">
                                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID #{order.id}</span>
                                   <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", status.dot)} />
                                   <span className={cn("text-[10px] font-black uppercase tracking-widest", status.iconColor)}>
                                          {status.label}
                                   </span>
                                   {order.status === "DELIVERED" && (
                                          <div className="text-[10px] font-black text-slate-200 uppercase tracking-[0.2em] ml-auto">
                                                 Sincronizado
                                          </div>
                                   )}
                            </div>

                            <h3 className="text-2xl font-black text-foreground leading-tight tracking-tighter truncate group-hover:text-primary transition-colors">
                                   {order.client.name}
                            </h3>

                            <div className="flex items-center gap-3 text-xs font-black text-slate-400 mt-2 px-1 uppercase tracking-widest opacity-60 overflow-hidden">
                                   <MapPin className="w-4 h-4 text-primary shrink-0 opacity-70" />
                                   <span className="truncate">{order.client.address}</span>
                            </div>

                            {/* Items Preview */}
                            {order.items.length > 0 && (
                                   <div className="flex items-center gap-2 mt-6 flex-wrap">
                                          {order.items.map((item: any) => (
                                                 <div key={item.id} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white transition-colors group/item">
                                                        <span className="text-[11px] font-black text-primary">{item.quantity}×</span>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.product.name}</span>
                                                 </div>
                                          ))}
                                   </div>
                            )}
                     </div>

                     {/* Right Side Info & Actions */}
                     <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-6 sm:w-48 w-full border-t sm:border-t-0 sm:border-l border-slate-50 pt-6 sm:pt-0 sm:pl-8">
                            <div className="text-right shrink-0">
                                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Monto Total</p>
                                   <div className="text-3xl font-black text-foreground tracking-tighter tabular-nums leading-none">
                                          <span className="text-lg font-black text-primary mr-1 opacity-30">$</span>{order.totalAmount.toLocaleString()}
                                   </div>
                            </div>

                            <div className="flex gap-2">
                                   {isPending && (
                                          <>
                                                 <button
                                                        onClick={() => onCancel(order.id)}
                                                        className="h-12 w-12 rounded-[1.2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95 group/btn"
                                                        title="Cancelar"
                                                 >
                                                        <XCircle className="w-6 h-6 stroke-[2.5px] group-hover/btn:rotate-12 transition-transform" />
                                                 </button>
                                          </>
                                   )}
                                   <button
                                          className="h-12 w-12 rounded-[1.2rem] bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 hover:text-primary hover:border-primary/20 transition-all active:scale-95 group/btn"
                                          title="Detalles"
                                   >
                                          <ArrowRight className="w-6 h-6 stroke-[2.5px] group-hover/btn:translate-x-1 transition-transform" />
                                   </button>
                            </div>
                     </div>
              </div>
       );
}
