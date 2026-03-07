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
              <div className="space-y-4">
                     {/* Search + count */}
                     <div className="flex items-center gap-2">
                            <div className="relative group flex-1">
                                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                   <input
                                          type="text"
                                          placeholder="Buscar pedidos por cliente o ID..."
                                          value={search}
                                          onChange={(e) => setSearch(e.target.value)}
                                          className="w-full h-11 bg-white border border-border rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60 shadow-sm"
                                   />
                            </div>
                            <div className="px-3 h-11 rounded-xl bg-muted border border-border flex items-center gap-2 shrink-0">
                                   <div className={cn("w-1.5 h-1.5 rounded-full", filtered.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{filtered.length}</span>
                            </div>
                     </div>

                     {/* Orders */}
                     <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                   {filtered.length === 0 ? (
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 className="py-16 text-center rounded-xl bg-white border border-dashed border-border"
                                          >
                                                 <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
                                                 <p className="font-semibold text-muted-foreground/40 text-sm italic">No se encontraron pedidos</p>
                                          </motion.div>
                                   ) : (
                                          filtered.map((order, idx) => (
                                                 <motion.div
                                                        key={order.id}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.98 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ duration: 0.2, delay: idx * 0.02 }}
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
                     bg: "bg-emerald-50",
                     iconColor: "text-emerald-600",
                     borderColor: "border-emerald-100",
                     dot: "bg-emerald-500",
                     icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              },
              CANCELLED: {
                     label: "Cancelado",
                     bg: "bg-slate-100",
                     iconColor: "text-slate-400",
                     borderColor: "border-slate-200",
                     dot: "bg-slate-400",
                     icon: <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              },
              CONFIRMED: {
                     label: "Pendiente",
                     bg: "bg-amber-50",
                     iconColor: "text-amber-600",
                     borderColor: "border-amber-100",
                     dot: "bg-amber-500",
                     icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              },
       };
       const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.CONFIRMED;
       const isPending = order.status !== "DELIVERED" && order.status !== "CANCELLED";

       return (
              <div className="bg-white border border-border rounded-xl p-4 sm:p-5 card-shadow hover:card-shadow-md transition-all duration-200 group relative">
                     <div className="flex items-start gap-3 sm:gap-4">
                            {/* Status Icon */}
                            <div className={cn(
                                   "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105",
                                   status.bg, status.borderColor, status.iconColor
                            )}>
                                   {status.icon}
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 min-w-0">
                                   <div className="flex items-center gap-2 mb-0.5">
                                          <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider">#{order.id}</span>
                                          <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", status.dot)} />
                                          <span className={cn("text-[10px] font-bold uppercase tracking-wider", status.iconColor)}>
                                                 {status.label}
                                          </span>
                                   </div>

                                   <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight truncate">
                                          {order.client.name}
                                   </h3>

                                   <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground mt-1">
                                          <MapPin className="w-3 h-3 text-primary shrink-0 opacity-70" />
                                          <span className="truncate">{order.client.address}</span>
                                   </div>
                            </div>

                            {/* Amount */}
                            <div className="text-right shrink-0">
                                   <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-wider mb-0.5">Total</p>
                                   <div className="text-base sm:text-xl font-bold text-foreground tracking-tight tabular-nums">
                                          <span className="text-[10px] text-muted-foreground mr-0.5 opacity-50">$</span>{order.totalAmount.toLocaleString()}
                                   </div>
                            </div>
                     </div>

                     {/* Items preview (sm+) */}
                     {order.items.length > 0 && (
                            <div className="hidden sm:flex items-center gap-2 mt-3 flex-wrap">
                                   {order.items.slice(0, 3).map((item: any) => (
                                          <div key={item.id} className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted border border-border">
                                                 <span className="text-[10px] font-bold text-foreground">{item.quantity}×</span>
                                                 <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[80px]">{item.product.name}</span>
                                          </div>
                                   ))}
                                   {order.items.length > 3 && (
                                          <span className="text-[10px] font-bold text-muted-foreground/40">+{order.items.length - 3} más</span>
                                   )}
                            </div>
                     )}

                     {/* Action buttons */}
                     {isPending && (
                            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
                                   <button
                                          onClick={() => onCancel(order.id)}
                                          className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 transition-all active:scale-95"
                                          title="Cancelar"
                                   >
                                          <XCircle className="w-3.5 h-3.5" />
                                   </button>
                                   <button
                                          onClick={() => onDelete(order.id)}
                                          className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 transition-all active:scale-95"
                                          title="Eliminar"
                                   >
                                          <Trash2 className="w-3.5 h-3.5" />
                                   </button>
                                   <Button
                                          size="sm"
                                          className="h-8 px-4 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                                   >
                                          Detalles <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                   </Button>
                            </div>
                     )}
              </div>
       );
}
