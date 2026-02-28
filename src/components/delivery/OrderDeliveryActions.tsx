"use strict";
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Truck, CheckCircle, X, Banknote, CreditCard, ArrowLeftRight, Loader2, Droplets, ArrowRight } from "lucide-react";
import { deliverOrder } from "@/actions/deliveries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderDeliveryActions({ order }: { order: any }) {
       const [isOpen, setIsOpen] = useState(false);
       const [returnedBottles, setReturnedBottles] = useState(0);
       const [loading, setLoading] = useState(false);

       if (order.status === "DELIVERED") {
              return (
                     <div className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.2em] bg-emerald-500/10 px-8 py-4 rounded-3xl border border-emerald-500/20 text-xs italic">
                            <CheckCircle className="w-5 h-5 animate-pulse" />
                            Pedido Entregado
                     </div>
              );
       }

       const handleDeliver = async (method: string) => {
              setLoading(true);
              try {
                     const result = await deliverOrder(order.id, {
                            paymentMethod: method,
                            returnedBottles,
                     });

                     if (result.success) {
                            toast.success("¡Entrega registrada!");
                            setIsOpen(false);
                     } else {
                            toast.error("Error: " + result.error);
                     }
              } catch (e) {
                     toast.error("Error inesperado en la conexión");
              } finally {
                     setLoading(false);
              }
       };

       return (
              <>
                     <Button
                            onClick={() => setIsOpen(true)}
                            variant="premium"
                            size="lg"
                            className="w-full sm:w-auto px-14 group"
                     >
                            <Truck className="w-6 h-6 mr-3 group-hover:translate-x-2 transition-transform duration-500" />
                            ENTREGAR
                     </Button>

                     <AnimatePresence>
                            {isOpen && (
                                   <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 overflow-hidden">
                                          {/* Backdrop */}
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setIsOpen(false)}
                                                 className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                                          />

                                          <motion.div
                                                 initial={{ y: "100%", opacity: 0 }}
                                                 animate={{ y: 0, opacity: 1 }}
                                                 exit={{ y: "100%", opacity: 0 }}
                                                 className="relative w-full max-w-xl bg-neutral-950/50 sm:rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col text-white"
                                          >
                                                 {/* Header */}
                                                 <div className="p-10 pb-6 flex justify-between items-center relative z-10">
                                                        <div className="flex items-center gap-6">
                                                               <div className="w-16 h-16 bg-white text-black rounded-[2rem] flex items-center justify-center shadow-2xl shadow-white/20">
                                                                      <Truck className="w-8 h-8" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Hoja de Ruta</h3>
                                                                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mt-3">Finalizar Pedido #{order.id}</p>
                                                               </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full w-14 h-14 hover:bg-white/5 border border-white/5">
                                                               <X className="w-8 h-8" />
                                                        </Button>
                                                 </div>

                                                 <div className="px-10 pb-10 space-y-10 relative z-10">
                                                        {/* Massive Total Display */}
                                                        <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 text-center relative overflow-hidden group">
                                                               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-primary/40 rounded-full" />
                                                               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Total Liquidación</p>
                                                               <p className="text-8xl font-black tracking-tighter text-white tabular-nums">${order.totalAmount.toLocaleString()}</p>
                                                        </div>

                                                        {/* Digital Counter for Bottles */}
                                                        <div className="space-y-6">
                                                               <div className="flex justify-between items-center px-4">
                                                                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Envases Retornados</label>
                                                                      <button
                                                                             onClick={() => {
                                                                                    const returnableCount = order.items.reduce((acc: number, item: any) =>
                                                                                           item.product.isReturnable ? acc + item.quantity : acc
                                                                                           , 0);
                                                                                    setReturnedBottles(returnableCount);
                                                                             }}
                                                                             className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-500 rounded-[1.5rem] border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-95"
                                                                      >
                                                                             <Droplets className="w-4 h-4" /> CARGAR TODOS
                                                                      </button>
                                                               </div>
                                                               <div className="flex items-center gap-6">
                                                                      <button
                                                                             type="button"
                                                                             className="w-24 h-24 rounded-[2.5rem] border border-white/10 bg-white/5 text-5xl font-black hover:bg-white/10 active:scale-90 transition-all"
                                                                             onClick={() => setReturnedBottles(Math.max(0, returnedBottles - 1))}
                                                                      >-</button>
                                                                      <div className="flex-1 h-24 bg-black/60 border border-white/10 rounded-[3rem] flex items-center justify-center text-6xl font-black tracking-tighter text-white tabular-nums">
                                                                             {returnedBottles}
                                                                      </div>
                                                                      <button
                                                                             type="button"
                                                                             className="w-24 h-24 rounded-[2.5rem] border border-white/10 bg-white/5 text-5xl font-black hover:bg-white/10 active:scale-90 transition-all"
                                                                             onClick={() => setReturnedBottles(returnedBottles + 1)}
                                                                      >+</button>
                                                               </div>
                                                        </div>

                                                        {/* Payment Actions using the standard radical style */}
                                                        <div className="space-y-4">
                                                               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-4">Método de Pago</p>
                                                               <div className="grid grid-cols-1 gap-4">
                                                                      <button
                                                                             disabled={loading}
                                                                             onClick={() => handleDeliver("CASH")}
                                                                             className="group w-full flex items-center justify-between p-7 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-emerald-500 hover:border-emerald-500 transition-all text-left relative overflow-hidden active:scale-[0.98]"
                                                                      >
                                                                             <div className="flex items-center gap-6 relative z-10">
                                                                                    <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl group-hover:bg-white group-hover:text-emerald-500 transition-all">
                                                                                           <Banknote className="w-8 h-8" />
                                                                                    </div>
                                                                                    <div>
                                                                                           <div className="font-black text-2xl text-white group-hover:text-white tracking-tight">EFECTIVO</div>
                                                                                           <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1 group-hover:text-white/60 italic">Cierre físico en caja</div>
                                                                                    </div>
                                                                             </div>
                                                                             <ArrowRight className="w-8 h-8 text-white/10 group-hover:text-white group-hover:translate-x-2 transition-all relative z-10" />
                                                                      </button>

                                                                      <button
                                                                             disabled={loading}
                                                                             onClick={() => handleDeliver("CURRENT_ACCOUNT")}
                                                                             className="group w-full flex items-center justify-between p-7 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-rose-500 hover:border-rose-500 transition-all text-left relative overflow-hidden active:scale-[0.98]"
                                                                      >
                                                                             <div className="flex items-center gap-6 relative z-10">
                                                                                    <div className="w-16 h-16 bg-rose-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl group-hover:bg-white group-hover:text-rose-500 transition-all">
                                                                                           <ArrowLeftRight className="w-8 h-8" />
                                                                                    </div>
                                                                                    <div>
                                                                                           <div className="font-black text-2xl text-white group-hover:text-white tracking-tight">CUENTA CORRIENTE</div>
                                                                                           <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1 group-hover:text-white/60 italic">Cargar deuda al cliente</div>
                                                                                    </div>
                                                                             </div>
                                                                             <ArrowRight className="w-8 h-8 text-white/10 group-hover:text-white group-hover:translate-x-2 transition-all relative z-10" />
                                                                      </button>

                                                                      <button
                                                                             disabled={loading}
                                                                             onClick={() => handleDeliver("TRANSFER")}
                                                                             className="group w-full flex items-center justify-between p-7 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-blue-600 hover:border-blue-600 transition-all text-left relative overflow-hidden active:scale-[0.98]"
                                                                      >
                                                                             <div className="flex items-center gap-6 relative z-10">
                                                                                    <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl group-hover:bg-white group-hover:text-blue-600 transition-all">
                                                                                           <CreditCard className="w-8 h-8" />
                                                                                    </div>
                                                                                    <div>
                                                                                           <div className="font-black text-2xl text-white group-hover:text-white tracking-tight">TRANSFERENCIA</div>
                                                                                           <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1 group-hover:text-white/60 italic">Cobro bancario / digital</div>
                                                                                    </div>
                                                                             </div>
                                                                             <ArrowRight className="w-8 h-8 text-white/10 group-hover:text-white group-hover:translate-x-2 transition-all relative z-10" />
                                                                      </button>
                                                               </div>
                                                        </div>

                                                        {loading && (
                                                               <div className="flex items-center justify-center gap-6 py-6 bg-white/5 rounded-[2rem] border border-white/5 animate-pulse">
                                                                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                                                      <span className="font-black uppercase tracking-[0.4em] text-xs">Finalizando Operación...</span>
                                                               </div>
                                                        )}
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </>
       );
}
