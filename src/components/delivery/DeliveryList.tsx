"use client";

import { useState } from "react";
import { Truck, Calendar, Clock, CheckCircle, Eye, Trash2, Navigation, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteDelivery } from "@/actions/deliveries";
import { toast } from "sonner";
import Link from "next/link";

interface Delivery {
       id: number;
       createdAt: Date;
       status: string;
       notes: string | null;
       ordersCount: number;
       deliveredCount: number;
}

export default function DeliveryList({ initialDeliveries }: { initialDeliveries: any[] }) {
       const [deliveries, setDeliveries] = useState(initialDeliveries);

       const handleDelete = async (id: number) => {
              if (!confirm("¿Eliminar este reparto? Los pedidos volverán a estar pendientes.")) return;

              const result = await deleteDelivery(id);
              if (result.success) {
                     setDeliveries(prev => prev.filter(d => d.id !== id));
                     toast.success("Reparto eliminado");
              } else {
                     toast.error("Error al eliminar: " + result.error);
              }
       };

       if (deliveries.length === 0) {
              return (
                     <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-[2rem]">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 mb-5">
                                   <Truck className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-black text-white mb-2">No hay repartos</h3>
                            <p className="text-sm text-white/30">Crea uno nuevo para comenzar la distribución del día.</p>
                     </div>
              );
       }

       return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {deliveries.map((delivery, index) => (
                            <DeliveryCard
                                   key={delivery.id}
                                   delivery={delivery}
                                   onDelete={() => handleDelete(delivery.id)}
                                   delay={index * 0.05}
                            />
                     ))}
              </div>
       );
}

function DeliveryCard({ delivery, onDelete, delay }: { delivery: any, onDelete: () => void, delay: number }) {
       const isCompleted = delivery.deliveredCount === delivery.ordersCount && delivery.ordersCount > 0;
       const progress = delivery.ordersCount > 0 ? (delivery.deliveredCount / delivery.ordersCount) * 100 : 0;

       return (
              <div
                     className="bg-white/[0.02] border border-white/10 rounded-2xl sm:rounded-[2rem] overflow-hidden hover:border-white/20 transition-all animate-fade-in-up"
                     style={{ animationDelay: `${delay}s` }}
              >
                     {/* Top */}
                     <div className="p-5 pb-4">
                            <div className="flex justify-between items-start mb-4">
                                   <div>
                                          <div className="flex items-center gap-2 mb-1">
                                                 <span className="font-mono text-xs font-bold text-white/30">#{delivery.id}</span>
                                                 <StatusBadge status={isCompleted ? "COMPLETED" : "PENDING"} />
                                          </div>
                                          <div className="flex items-center gap-2 text-xs text-white/40 font-medium">
                                                 <Calendar className="w-3 h-3 shrink-0" />
                                                 {new Date(delivery.createdAt).toLocaleDateString('es-AR')}
                                          </div>
                                   </div>
                                   <button
                                          onClick={onDelete}
                                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all"
                                   >
                                          <Trash2 className="w-3.5 h-3.5" />
                                   </button>
                            </div>

                            {/* Progress number */}
                            <div className="flex justify-between items-end mb-3">
                                   <span className="text-4xl font-black tracking-tighter text-white">
                                          {delivery.deliveredCount}
                                          <span className="text-xl text-white/30">/{delivery.ordersCount}</span>
                                   </span>
                                   <span className={cn(
                                          "text-sm font-black tracking-widest tabular-nums",
                                          isCompleted ? "text-emerald-500" : "text-primary"
                                   )}>
                                          {Math.round(progress)}%
                                   </span>
                            </div>

                            {/* Progress bar */}
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                   <div
                                          className={cn(
                                                 "h-full rounded-full transition-all duration-1000",
                                                 isCompleted
                                                        ? "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                                        : "bg-gradient-to-r from-primary to-violet-400 shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                                          )}
                                          style={{ width: `${progress}%` }}
                                   />
                            </div>
                     </div>

                     {/* Actions */}
                     <div className="grid grid-cols-2 border-t border-white/5">
                            <Link
                                   href={`/repartos/${delivery.id}`}
                                   className="flex items-center justify-center gap-2 py-3.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all border-r border-white/5"
                            >
                                   <Eye className="w-3.5 h-3.5" />
                                   Ver detalle
                            </Link>
                            <Link
                                   href={`/repartos/${delivery.id}?modo=repartidor`}
                                   className={cn(
                                          "flex items-center justify-center gap-2 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all",
                                          isCompleted
                                                 ? "text-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5"
                                                 : "text-primary hover:bg-primary/10"
                                   )}
                            >
                                   <Navigation className="w-3.5 h-3.5" />
                                   {isCompleted ? "Revisar" : "Iniciar"}
                            </Link>
                     </div>
              </div>
       );
}

function StatusBadge({ status }: { status: string }) {
       const isCompleted = status === "COMPLETED";
       return (
              <div className={cn(
                     "flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                     isCompleted
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              )}>
                     {isCompleted ? <CheckCircle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                     {isCompleted ? "Completado" : "En Curso"}
              </div>
       );
}
