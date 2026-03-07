"use client";

import { useState } from "react";
import {
       CheckCircle2, Clock, XCircle, MapPin, User,
       ChevronRight, ChevronLeft, Package, DollarSign,
       MessageCircle, Navigation, Phone, ArrowLeft, ArrowRight, Check
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
              toast.success(status === "delivered" ? "✅ Entrega exitosa" : "⚠️ Cliente ausente", {
                     style: { borderRadius: '1rem', fontWeight: '800' }
              });

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
              delivered: { icon: CheckCircle2, label: "Completado", color: "text-emerald-500 bg-emerald-50 border-emerald-100 shadow-emerald-500/10" },
              absent: { icon: XCircle, label: "Ausente", color: "text-rose-500 bg-rose-50 border-rose-100 shadow-rose-500/10" },
              pending: { icon: Clock, label: "En Espera", color: "text-amber-500 bg-amber-50 border-amber-100 shadow-amber-500/10" },
       };

       return (
              <div className="flex flex-col min-h-full animate-fade-in-up">

                     {/* iOS LARGE TITLE & PROGRESS AREA */}
                     <header className="px-1 pt-2 pb-8 space-y-6">
                            <div className="flex flex-col gap-1">
                                   <div className="flex items-center gap-1.5 opacity-40 mb-1 px-1">
                                          <Navigation className="w-3.5 h-3.5 fill-current" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logística de Hoy</span>
                                   </div>
                                   <h1 className="text-4xl font-black tracking-tight text-foreground leading-tight px-1 uppercase">Ruta Activa</h1>
                            </div>

                            <div className="space-y-3 px-1">
                                   <div className="flex justify-between items-end">
                                          <div className="flex items-baseline gap-2">
                                                 <span className="text-3xl font-black text-foreground">{deliveredCount}</span>
                                                 <span className="text-sm font-black text-muted-foreground/30 uppercase tracking-widest">/ {stops.length} Paradas</span>
                                          </div>
                                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1.5 rounded-full shadow-sm">
                                                 {Math.round(progress)}% Completado
                                          </span>
                                   </div>
                                   <div className="h-3.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
                                          <motion.div
                                                 className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(37,123,244,0.4)]"
                                                 animate={{ width: `${progress}%` }}
                                                 transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
                                          />
                                   </div>
                            </div>
                     </header>

                     {/* iOS HORIZONTAL SCROLL MAP STOPS */}
                     <div className="flex gap-4 overflow-x-auto no-scrollbar pb-10 px-1 snap-x scroll-smooth">
                            {localStops.map((stop, i) => {
                                   const isActive = i === currentIdx;
                                   const isCompleted = stop.status === "delivered";
                                   const isAbsent = stop.status === "absent";

                                   return (
                                          <motion.button
                                                 key={stop.orderId}
                                                 onClick={() => setCurrentIdx(i)}
                                                 whileTap={{ scale: 0.9 }}
                                                 className={cn(
                                                        "shrink-0 w-16 h-16 rounded-[1.5rem] border-2 flex flex-col items-center justify-center transition-all snap-center relative shadow-lg",
                                                        isActive
                                                               ? "bg-primary border-primary text-white shadow-primary/25 scale-110 z-10"
                                                               : "bg-white border-transparent text-slate-300 shadow-slate-200/40",
                                                        !isActive && isCompleted && "bg-emerald-50 text-emerald-500 shadow-emerald-500/10 scale-95 opacity-80",
                                                        !isActive && isAbsent && "bg-rose-50 text-rose-500 shadow-rose-500/10 scale-95 opacity-80"
                                                 )}
                                          >
                                                 <span className={cn("text-lg font-black tracking-tighter", isActive ? "text-white" : "text-foreground")}>{i + 1}</span>
                                                 {isActive && (
                                                        <motion.div
                                                               layoutId="active-indicator-route"
                                                               className="absolute -bottom-3 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(37,123,244,1)]"
                                                        />
                                                 )}
                                          </motion.button>
                                   );
                            })}
                     </div>

                     {/* CURRENT STOP DETAIL - iOS PREMIUM CARD */}
                     <AnimatePresence mode="wait">
                            <motion.div
                                   key={currentIdx}
                                   initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                   exit={{ opacity: 0, scale: 0.95, y: -30 }}
                                   transition={{ type: "spring", damping: 30, stiffness: 200 }}
                                   className="flex-1 space-y-6"
                            >
                                   <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-border/40 space-y-8 relative overflow-hidden">
                                          {/* ID & Status Badge */}
                                          <div className="flex items-center justify-between">
                                                 <div className={cn(
                                                        "px-4 py-1.5 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                                                        statusConfig[current.status].color
                                                 )}>
                                                        {statusConfig[current.status].label}
                                                 </div>
                                                 <div className="w-14 h-14 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-300 shadow-inner">
                                                        <User className="w-7 h-7" />
                                                 </div>
                                          </div>

                                          <div className="space-y-4">
                                                 <h2 className="text-4xl font-black tracking-tighter text-foreground leading-[1.1]">{current.clientName}</h2>
                                                 <div className="flex items-start gap-2.5 text-muted-foreground/60">
                                                        <div className="w-6 h-6 bg-primary/5 rounded-lg flex items-center justify-center mt-1">
                                                               <MapPin className="w-3.5 h-3.5 text-primary" />
                                                        </div>
                                                        <span className="text-sm font-bold leading-relaxed">{current.clientAddress}</span>
                                                 </div>
                                          </div>

                                          {/* iOS Style Financial Widgets */}
                                          <div className="grid grid-cols-2 gap-4">
                                                 <div className="bg-rose-50/50 border border-rose-100/50 rounded-[2rem] p-6 shadow-inner group">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-rose-500/40 mb-1 group-hover:text-rose-500 transition-colors">Deuda Antigua</p>
                                                        <div className="text-2xl font-black text-rose-600 tracking-tight tabular-nums">${current.clientBalance.toLocaleString()}</div>
                                                 </div>
                                                 <div className="bg-slate-50/50 border border-slate-100/50 rounded-[2rem] p-6 shadow-inner group">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500/30 mb-1 group-hover:text-slate-500 transition-colors">Gasto Actual</p>
                                                        <div className="text-2xl font-black text-slate-800 tracking-tight tabular-nums">${current.totalAmount.toLocaleString()}</div>
                                                 </div>
                                          </div>

                                          {/* iOS Style Collapsible Items List */}
                                          <div className="pt-4 border-t border-slate-50">
                                                 <button
                                                        onClick={() => setShowItems(!showItems)}
                                                        className="w-full h-16 flex items-center justify-between px-6 bg-slate-50/50 rounded-[1.8rem] border border-slate-100/50 group active:scale-[0.98] transition-all"
                                                 >
                                                        <div className="flex items-center gap-3">
                                                               <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary">
                                                                      <Package className="w-5 h-5" />
                                                               </div>
                                                               <span className="text-sm font-black text-foreground tracking-tight uppercase">Productos en Pedido</span>
                                                        </div>
                                                        <div className={cn("w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 transition-transform shadow-sm", showItems && "rotate-90")}>
                                                               <ChevronRight className="w-4 h-4" />
                                                        </div>
                                                 </button>

                                                 <AnimatePresence>
                                                        {showItems && (
                                                               <motion.div
                                                                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                                                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                                                                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                                                      className="overflow-hidden"
                                                               >
                                                                      <div className="grid grid-cols-1 gap-3 pt-6">
                                                                             {current.items.map((item, i) => (
                                                                                    <div key={i} className="flex items-center justify-between px-6 h-16 bg-white border border-slate-100 rounded-2xl shadow-sm group">
                                                                                           <span className="text-sm font-black text-slate-700 tracking-tight uppercase group-hover:text-primary transition-colors">{item.name}</span>
                                                                                           <div className="px-3 py-1.5 bg-primary rounded-xl shadow-lg shadow-primary/20">
                                                                                                  <span className="text-sm font-black text-white">{item.qty} un.</span>
                                                                                           </div>
                                                                                    </div>
                                                                             ))}
                                                                      </div>
                                                               </motion.div>
                                                        )}
                                                 </AnimatePresence>
                                          </div>

                                          {/* Main Dispatch Actions */}
                                          {current.status === "pending" && (
                                                 <div className="space-y-4 pt-6">
                                                        <Button
                                                               onClick={() => markStatus("delivered")}
                                                               className="w-full h-20 rounded-[2.2rem] bg-primary text-white shadow-2xl shadow-primary/30 font-black text-xl uppercase tracking-[0.2em] gap-4 active:scale-95 transition-all"
                                                        >
                                                               <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                                                      <Check className="w-6 h-6 stroke-[4px]" />
                                                               </div>
                                                               Confirmar Entrega
                                                        </Button>

                                                        <div className="grid grid-cols-2 gap-4">
                                                               <Button
                                                                      onClick={() => markStatus("absent")}
                                                                      variant="ghost"
                                                                      className="h-16 rounded-[1.8rem] bg-rose-50 border border-rose-100 shadow-sm text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] gap-3 active:scale-95 transition-all"
                                                               >
                                                                      <XCircle className="w-5 h-5" />
                                                                      Ausente
                                                               </Button>
                                                               <Button
                                                                      onClick={handleWhatsApp}
                                                                      variant="ghost"
                                                                      className="h-16 rounded-[1.8rem] bg-emerald-50 border border-emerald-100 shadow-sm text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] gap-3 active:scale-95 transition-all"
                                                               >
                                                                      <MessageCircle className="w-5 h-5" />
                                                                      WhatsApp
                                                               </Button>
                                                        </div>
                                                 </div>
                                          )}
                                   </div>
                            </motion.div>
                     </AnimatePresence>

                     {/* iOS STICKY GLASS NAVIGATION BAR */}
                     <div className="sticky bottom-0 -mx-6 px-10 pt-10 pb-12 bg-white/70 backdrop-blur-2xl border-t border-slate-100 z-50 flex items-center justify-between">
                            <button
                                   onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                                   disabled={currentIdx === 0}
                                   className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 active:scale-90 disabled:opacity-20 transition-all shadow-sm"
                            >
                                   <ChevronLeft className="w-7 h-7 stroke-[3px]" />
                            </button>

                            <div className="flex flex-col items-center">
                                   <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] mb-1">POSICIÓN</span>
                                   <div className="flex items-baseline gap-1">
                                          <span className="text-lg font-black text-foreground">{currentIdx + 1}</span>
                                          <span className="text-xs font-bold text-muted-foreground/40">/ {stops.length}</span>
                                   </div>
                            </div>

                            <button
                                   onClick={() => setCurrentIdx(i => Math.min(stops.length - 1, i + 1))}
                                   disabled={currentIdx === stops.length - 1}
                                   className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white active:scale-90 disabled:opacity-20 transition-all shadow-lg"
                            >
                                   <ChevronRight className="w-7 h-7 stroke-[3px]" />
                            </button>
                     </div>
              </div>
       );
}
