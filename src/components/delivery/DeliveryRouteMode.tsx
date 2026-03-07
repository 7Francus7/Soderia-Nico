"use client";

import { useState } from "react";
import {
       CheckCircle2, Clock, XCircle, MapPin, User,
       ChevronRight, ChevronLeft, Package, DollarSign,
       MessageCircle, Navigation
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
                     setTimeout(() => setCurrentIdx(nextPending), 600);
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
              delivered: { icon: CheckCircle2, label: "Entregado", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
              absent: { icon: XCircle, label: "Ausente", color: "text-rose-400 bg-rose-400/10 border-rose-400/20" },
              pending: { icon: Clock, label: "Pendiente", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
       };

       return (
              <div className="min-h-[calc(100vh-14rem)] flex flex-col text-white">

                     {/* PROGRESS BAR */}
                     <div className="mb-6 space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                                   <span>Paradas completadas</span>
                                   <span>{deliveredCount} / {stops.length}</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                   <motion.div
                                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                                          animate={{ width: `${progress}%` }}
                                          transition={{ duration: 0.5, ease: "easeOut" }}
                                   />
                            </div>
                     </div>

                     {/* STOPS MINI MAP */}
                     <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
                            {localStops.map((stop, i) => {
                                   const cfg = statusConfig[stop.status];
                                   return (
                                          <button
                                                 key={stop.orderId}
                                                 onClick={() => setCurrentIdx(i)}
                                                 className={cn(
                                                        "shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-all",
                                                        i === currentIdx ? "scale-110 ring-2 ring-white" : "opacity-50",
                                                        stop.status === "delivered" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-500"
                                                               : stop.status === "absent" ? "bg-rose-500/20 border-rose-500/30 text-rose-400"
                                                                      : "bg-white/5 border-white/10 text-white/40"
                                                 )}
                                          >
                                                 <cfg.icon className="w-4 h-4" />
                                          </button>
                                   );
                            })}
                     </div>

                     {/* CURRENT STOP CARD */}
                     <AnimatePresence mode="wait">
                            <motion.div
                                   key={currentIdx}
                                   initial={{ opacity: 0, x: 30 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   exit={{ opacity: 0, x: -30 }}
                                   transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                   className="flex-1 space-y-4"
                            >
                                   {/* Status + Number */}
                                   <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                                 <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                                                        Parada {currentIdx + 1} de {stops.length}
                                                 </div>
                                          </div>
                                          <div className={cn(
                                                 "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wide",
                                                 statusConfig[current.status].color
                                          )}>
                                                 {current.status === "delivered" ? <CheckCircle2 className="w-3 h-3" />
                                                        : current.status === "absent" ? <XCircle className="w-3 h-3" />
                                                               : <Clock className="w-3 h-3" />}
                                                 {statusConfig[current.status].label}
                                          </div>
                                   </div>

                                   {/* Client Info */}
                                   <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
                                          <div className="flex items-start gap-4">
                                                 <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                                                        <User className="w-7 h-7 text-white/30" />
                                                 </div>
                                                 <div className="flex-1 min-w-0">
                                                        <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-tight">{current.clientName}</h2>
                                                        <div className="flex items-center gap-2 text-white/40 text-xs font-bold mt-1">
                                                               <MapPin className="w-3 h-3 shrink-0 text-primary" />
                                                               <span className="truncate">{current.clientAddress}</span>
                                                        </div>
                                                        {current.clientPhone && (
                                                               <div className="text-xs font-bold text-primary mt-1">{current.clientPhone}</div>
                                                        )}
                                                 </div>
                                          </div>

                                          {/* Financials */}
                                          <div className="grid grid-cols-2 gap-3">
                                                 <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3">
                                                        <p className="text-[8px] font-black uppercase tracking-wide text-rose-400/60 mb-1">Deuda pendiente</p>
                                                        <div className="text-xl font-black text-rose-400 tracking-tighter tabular-nums">
                                                               ${current.clientBalance.toLocaleString()}
                                                        </div>
                                                 </div>
                                                 <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                                        <p className="text-[8px] font-black uppercase tracking-wide text-white/30 mb-1">Este pedido</p>
                                                        <div className="text-xl font-black text-white tracking-tighter tabular-nums">
                                                               ${current.totalAmount.toLocaleString()}
                                                        </div>
                                                 </div>
                                          </div>

                                          {/* Items */}
                                          <div>
                                                 <button
                                                        onClick={() => setShowItems(v => !v)}
                                                        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors mb-2"
                                                 >
                                                        <Package className="w-3 h-3" />
                                                        {current.items.length} producto(s) a entregar
                                                        <ChevronRight className={cn("w-3 h-3 transition-transform", showItems && "rotate-90")} />
                                                 </button>
                                                 <AnimatePresence>
                                                        {showItems && (
                                                               <motion.div
                                                                      initial={{ height: 0, opacity: 0 }}
                                                                      animate={{ height: "auto", opacity: 1 }}
                                                                      exit={{ height: 0, opacity: 0 }}
                                                                      className="overflow-hidden"
                                                               >
                                                                      <div className="space-y-1.5 pt-1">
                                                                             {current.items.map((item, i) => (
                                                                                    <div key={i} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl">
                                                                                           <span className="text-sm font-bold text-white/70">{item.name}</span>
                                                                                           <span className="text-sm font-black text-white">{item.qty}×</span>
                                                                                    </div>
                                                                             ))}
                                                                      </div>
                                                               </motion.div>
                                                        )}
                                                 </AnimatePresence>
                                          </div>
                                   </div>

                                   {/* ACTION BUTTONS */}
                                   {current.status === "pending" && (
                                          <div className="space-y-3">
                                                 {/* Deliver */}
                                                 <button
                                                        onClick={() => markStatus("delivered")}
                                                        className="w-full h-16 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-emerald-500/30"
                                                 >
                                                        <CheckCircle2 className="w-6 h-6" />
                                                        ✓ ENTREGADO
                                                 </button>

                                                 <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                               onClick={() => markStatus("absent")}
                                                               className="h-12 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                                                        >
                                                               <XCircle className="w-4 h-4" />
                                                               Ausente
                                                        </button>
                                                        <button
                                                               onClick={handleWhatsApp}
                                                               className="h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                                                        >
                                                               <MessageCircle className="w-4 h-4" />
                                                               WhatsApp
                                                        </button>
                                                 </div>
                                          </div>
                                   )}
                            </motion.div>
                     </AnimatePresence>

                     {/* NAV ARROWS */}
                     <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                            <button
                                   onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                                   disabled={currentIdx === 0}
                                   className="h-12 px-5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider"
                            >
                                   <ChevronLeft className="w-4 h-4" /> Anterior
                            </button>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                                   {currentIdx + 1} / {stops.length}
                            </span>
                            <button
                                   onClick={() => setCurrentIdx(i => Math.min(stops.length - 1, i + 1))}
                                   disabled={currentIdx === stops.length - 1}
                                   className="h-12 px-5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider"
                            >
                                   Siguiente <ChevronRight className="w-4 h-4" />
                            </button>
                     </div>
              </div>
       );
}
