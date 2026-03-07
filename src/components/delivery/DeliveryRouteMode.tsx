"use client";

import { useState } from "react";
import {
       CheckCircle2, Clock, XCircle, MapPin, User,
       ChevronRight, ChevronLeft, Package, DollarSign,
       MessageCircle, Navigation, Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface DeliveryStop {
       orderId: number;
       clientName: string;
       clientAddress: string;
       clientPhone?: string;
       clientBalance: number;
       items: { name: string; qty: number }[];
       totalAmount: number;
       status: "pending" | "delivered" | "absent";
}

export default function DeliveryRouteMode({ delivery, stops }: {
       delivery: any;
       stops: DeliveryStop[];
}) {
       const [currentIdx, setCurrentIdx] = useState(() => {
              const firstPending = stops.findIndex(s => s.status === "pending");
              return firstPending >= 0 ? firstPending : 0;
       });
       const [localStops, setLocalStops] = useState(stops);
       const [showItems, setShowItems] = useState(false);

       const current = localStops[currentIdx];
       const deliveredCount = localStops.filter(s => s.status === "delivered").length;
       const progress = stops.length > 0 ? (deliveredCount / stops.length) * 100 : 0;

       const markStatus = (status: "delivered" | "absent") => {
              setLocalStops(prev => prev.map((s, i) =>
                     i === currentIdx ? { ...s, status } : s
              ));
              toast.success(status === "delivered" ? "✅ Entregado" : "⚠️ Ausente registrado");

              // Auto-advance to next pending
              const nextPending = localStops.findIndex((s, i) => i > currentIdx && s.status === "pending");
              if (nextPending >= 0) {
                     setTimeout(() => {
                            setCurrentIdx(nextPending);
                            setShowItems(false);
                     }, 600);
              }
       };

       const handleWhatsApp = () => {
              if (!current.clientPhone) {
                     toast.error("Este cliente no tiene teléfono registrado");
                     return;
              }
              const msg = `Hola ${current.clientName}! Soy del reparto de Sodería Nico. Paso en unos minutos por ${current.clientAddress}.`;
              window.open(`https://wa.me/${current.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
       };

       const statusConfig = {
              delivered: { icon: CheckCircle2, label: "Entregado", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              absent: { icon: XCircle, label: "Ausente", color: "text-rose-600 bg-rose-50 border-rose-100" },
              pending: { icon: Clock, label: "Pendiente", color: "text-amber-600 bg-amber-50 border-amber-100" },
       };

       return (
              <div className="min-h-[calc(100vh-14rem)] flex flex-col">

                     {/* Progress Header */}
                     <div className="mb-6 space-y-2.5">
                            <div className="flex justify-between items-center px-1">
                                   <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Progreso del Reparto</span>
                                   </div>
                                   <span className="text-[10px] font-bold text-foreground bg-primary/10 px-2 py-0.5 rounded-full">{deliveredCount} / {stops.length} completados</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                                   <motion.div
                                          className="h-full bg-primary rounded-full shadow-sm"
                                          animate={{ width: `${progress}%` }}
                                          transition={{ duration: 0.8, ease: "circOut" }}
                                   />
                            </div>
                     </div>

                     {/* Stops Mini Map */}
                     <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 mb-2">
                            {localStops.map((stop, i) => {
                                   const cfg = statusConfig[stop.status];
                                   return (
                                          <button
                                                 key={stop.orderId}
                                                 onClick={() => setCurrentIdx(i)}
                                                 className={cn(
                                                        "shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center transition-all active:scale-95",
                                                        i === currentIdx ? "ring-2 ring-primary ring-offset-2 border-primary bg-primary text-white shadow-lg" : "bg-white border-border text-muted-foreground hover:border-primary/40",
                                                        i !== currentIdx && stop.status === "delivered" && "bg-emerald-50 border-emerald-100 text-emerald-600",
                                                        i !== currentIdx && stop.status === "absent" && "bg-rose-50 border-rose-100 text-rose-600"
                                                 )}
                                          >
                                                 {i === currentIdx ? (
                                                        <span className="text-sm font-bold">{i + 1}</span>
                                                 ) : (
                                                        <cfg.icon className="w-4 h-4" />
                                                 )}
                                          </button>
                                   );
                            })}
                     </div>

                     {/* Current Stop */}
                     <AnimatePresence mode="wait">
                            <motion.div
                                   key={currentIdx}
                                   initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                   exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                   className="flex-1 space-y-4"
                            >
                                   {/* Client Details Card */}
                                   <div className="bg-white border border-border rounded-2xl p-6 card-shadow-md space-y-5">
                                          <div className="flex items-start justify-between gap-4">
                                                 <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1.5 opacity-60">
                                                               <div className={cn("px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-widest", statusConfig[current.status].color)}>
                                                                      {statusConfig[current.status].label}
                                                               </div>
                                                               <span className="text-[10px] font-bold text-muted-foreground">Parada #{currentIdx + 1}</span>
                                                        </div>
                                                        <h2 className="text-2xl font-bold tracking-tight text-foreground leading-tight">{current.clientName}</h2>
                                                        <div className="flex items-start gap-1.5 text-muted-foreground text-[11px] font-bold mt-2 uppercase tracking-tight">
                                                               <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                                                               <span>{current.clientAddress}</span>
                                                        </div>
                                                 </div>
                                                 <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                                                        <User className="w-6 h-6" />
                                                 </div>
                                          </div>

                                          {/* Financials Summary */}
                                          <div className="grid grid-cols-2 gap-3">
                                                 <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 shadow-sm">
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-rose-500/70 mb-1">Deuda Anterior</p>
                                                        <div className="text-xl font-bold text-rose-600 tracking-tight tabular-nums">${current.clientBalance.toLocaleString()}</div>
                                                 </div>
                                                 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500/60 mb-1">Este Pedido</p>
                                                        <div className="text-xl font-bold text-slate-700 tracking-tight tabular-nums">${current.totalAmount.toLocaleString()}</div>
                                                 </div>
                                          </div>

                                          {/* Items Section */}
                                          <div className="border-t border-border pt-4">
                                                 <button
                                                        onClick={() => setShowItems(!showItems)}
                                                        className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-1"
                                                 >
                                                        <div className="flex items-center gap-2">
                                                               <Package className="w-3.5 h-3.5" />
                                                               <span>Lista de Productos ({current.items.length})</span>
                                                        </div>
                                                        <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", showItems && "rotate-90")} />
                                                 </button>
                                                 <AnimatePresence>
                                                        {showItems && (
                                                               <motion.div
                                                                      initial={{ height: 0 }}
                                                                      animate={{ height: "auto" }}
                                                                      exit={{ height: 0 }}
                                                                      className="overflow-hidden"
                                                               >
                                                                      <div className="space-y-1.5 pt-3">
                                                                             {current.items.map((item, i) => (
                                                                                    <div key={i} className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                                                                                           <span className="text-xs font-bold text-slate-600">{item.name}</span>
                                                                                           <div className="flex items-center gap-1.5">
                                                                                                  <span className="text-[10px] font-bold text-slate-400">UNID.</span>
                                                                                                  <span className="text-sm font-bold text-primary">{item.qty}</span>
                                                                                           </div>
                                                                                    </div>
                                                                             ))}
                                                                      </div>
                                                               </motion.div>
                                                        )}
                                                 </AnimatePresence>
                                          </div>
                                   </div>

                                   {/* Main Actions */}
                                   {current.status === "pending" && (
                                          <div className="space-y-3 pt-2">
                                                 <Button
                                                        onClick={() => markStatus("delivered")}
                                                        className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 font-bold text-lg uppercase tracking-widest gap-3 active:scale-[0.98]"
                                                 >
                                                        <CheckCircle2 className="w-6 h-6" />
                                                        CONFIRMAR ENTREGA
                                                 </Button>

                                                 <div className="grid grid-cols-2 gap-3">
                                                        <Button
                                                               onClick={() => markStatus("absent")}
                                                               variant="ghost"
                                                               className="h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 font-bold text-xs uppercase tracking-widest gap-2 shadow-sm"
                                                        >
                                                               <XCircle className="w-4 h-4" />
                                                               AUSENTE
                                                        </Button>
                                                        <Button
                                                               onClick={handleWhatsApp}
                                                               variant="ghost"
                                                               className="h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 font-bold text-xs uppercase tracking-widest gap-2 shadow-sm"
                                                        >
                                                               <MessageCircle className="w-4 h-4" />
                                                               WHATSAPP
                                                        </Button>
                                                 </div>
                                          </div>
                                   )}
                            </motion.div>
                     </AnimatePresence>

                     {/* Navigation Footer */}
                     <div className="mt-6 pt-5 border-t border-border flex items-center justify-between sticky bottom-0 bg-background/80 backdrop-blur-md pb-4">
                            <Button
                                   onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                                   disabled={currentIdx === 0}
                                   variant="ghost"
                                   className="h-11 px-4 rounded-xl border border-border bg-white text-muted-foreground text-[10px] font-bold uppercase tracking-widest gap-2"
                            >
                                   <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                            </Button>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                                   Parada {currentIdx + 1} / {stops.length}
                            </div>
                            <Button
                                   onClick={() => setCurrentIdx(i => Math.min(stops.length - 1, i + 1))}
                                   disabled={currentIdx === stops.length - 1}
                                   variant="ghost"
                                   className="h-11 px-4 rounded-xl border border-border bg-white text-muted-foreground text-[10px] font-bold uppercase tracking-widest gap-2"
                            >
                                   Siguiente <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                     </div>
              </div>
       );
}
