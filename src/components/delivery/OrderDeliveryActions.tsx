"use strict";
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Truck, CheckCircle, X, Banknote, CreditCard, ArrowLeftRight, Loader2, Droplets, ArrowRight, Minus, Plus } from "lucide-react";
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
                     <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-100 text-[10px] shadow-sm">
                            <CheckCircle className="w-4 h-4" />
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
                            size="lg"
                            className="w-full sm:w-auto px-10 rounded-xl shadow-lg shadow-primary/20 font-bold tracking-tight gap-2"
                     >
                            <Truck className="w-5 h-5" />
                            <span>ENTREGAR PEDIDO</span>
                     </Button>

                     <AnimatePresence>
                            {isOpen && (
                                   <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                                          {/* Backdrop */}
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setIsOpen(false)}
                                                 className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                          />

                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 className="relative w-full max-w-xl bg-background sm:rounded-2xl border-t sm:border border-border shadow-2xl overflow-hidden flex flex-col"
                                          >
                                                 {/* Header */}
                                                 <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white sticky top-0 z-20">
                                                        <div className="flex items-center gap-4">
                                                               <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg text-primary border border-primary/20">
                                                                      <Truck className="w-5 h-5" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-lg font-bold text-foreground leading-none">Finalizar Entrega</h3>
                                                                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">Pedido #{order.id}</p>
                                                               </div>
                                                        </div>
                                                        <button onClick={() => setIsOpen(false)} className="rounded-full w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                                                               <X className="w-5 h-5" />
                                                        </button>
                                                 </div>

                                                 <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                                                        {/* Total Card */}
                                                        <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center relative overflow-hidden shadow-inner">
                                                               <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                                                               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-2">Total a Cobrar</p>
                                                               <div className="text-5xl font-bold tracking-tight text-foreground tabular-nums">${order.totalAmount.toLocaleString()}</div>
                                                        </div>

                                                        {/* Bottles Counter */}
                                                        <div className="space-y-3">
                                                               <div className="flex justify-between items-center px-1">
                                                                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Envases Retornados</label>
                                                                      <button
                                                                             onClick={() => {
                                                                                    const returnableCount = order.items.reduce((acc: number, item: any) =>
                                                                                           item.product.isReturnable ? acc + item.quantity : acc
                                                                                           , 0);
                                                                                    setReturnedBottles(returnableCount);
                                                                             }}
                                                                             className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-all text-[9px] font-bold uppercase tracking-widest active:scale-95"
                                                                      >
                                                                             <Droplets className="w-3.5 h-3.5" /> CARGAR TOTAL
                                                                      </button>
                                                               </div>
                                                               <div className="flex items-center gap-4">
                                                                      <button
                                                                             type="button"
                                                                             className="w-14 h-14 rounded-xl border border-border bg-white flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 active:scale-95 shadow-sm transition-all"
                                                                             onClick={() => setReturnedBottles(Math.max(0, returnedBottles - 1))}
                                                                      ><Minus className="w-6 h-6" /></button>
                                                                      <div className="flex-1 h-14 bg-white border border-border rounded-xl flex items-center justify-center text-3xl font-bold tracking-tight text-foreground tabular-nums shadow-sm">
                                                                             {returnedBottles}
                                                                      </div>
                                                                      <button
                                                                             type="button"
                                                                             className="w-14 h-14 rounded-xl border border-border bg-white flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 active:scale-95 shadow-sm transition-all"
                                                                             onClick={() => setReturnedBottles(returnedBottles + 1)}
                                                                      ><Plus className="w-6 h-6" /></button>
                                                               </div>
                                                        </div>

                                                        {/* Payment Methods */}
                                                        <div className="space-y-3">
                                                               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Método de Pago</p>
                                                               <div className="grid grid-cols-1 gap-3">
                                                                      <button
                                                                             disabled={loading}
                                                                             onClick={() => handleDeliver("CASH")}
                                                                             className="group w-full flex items-center justify-between p-4 bg-white border border-border rounded-xl hover:border-emerald-200 transition-all text-left relative overflow-hidden active:scale-[0.99] card-shadow-sm hover:card-shadow-md"
                                                                      >
                                                                             <div className="flex items-center gap-4 relative z-10">
                                                                                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                                                           <Banknote className="w-6 h-6" />
                                                                                    </div>
                                                                                    <div>
                                                                                           <div className="font-bold text-lg text-foreground group-hover:text-emerald-700 transition-colors">EFECTIVO</div>
                                                                                           <div className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-0.5 group-hover:text-emerald-500/60 italic transition-colors">Pago físico presencial</div>
                                                                                    </div>
                                                                             </div>
                                                                             <ArrowRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                                                      </button>

                                                                      <button
                                                                             disabled={loading}
                                                                             onClick={() => handleDeliver("CURRENT_ACCOUNT")}
                                                                             className="group w-full flex items-center justify-between p-4 bg-white border border-border rounded-xl hover:border-rose-200 transition-all text-left relative overflow-hidden active:scale-[0.99] card-shadow-sm hover:card-shadow-md"
                                                                      >
                                                                             <div className="flex items-center gap-4 relative z-10">
                                                                                    <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-rose-600 group-hover:text-white transition-all">
                                                                                           <ArrowLeftRight className="w-6 h-6" />
                                                                                    </div>
                                                                                    <div>
                                                                                           <div className="font-bold text-lg text-foreground group-hover:text-rose-700 transition-colors">CUENTA CORRIENTE</div>
                                                                                           <div className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-0.5 group-hover:text-rose-500/60 italic transition-colors">Cargar saldo al cliente</div>
                                                                                    </div>
                                                                             </div>
                                                                             <ArrowRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                                                                      </button>

                                                                      <button
                                                                             disabled={loading}
                                                                             onClick={() => handleDeliver("TRANSFER")}
                                                                             className="group w-full flex items-center justify-between p-4 bg-white border border-border rounded-xl hover:border-blue-200 transition-all text-left relative overflow-hidden active:scale-[0.99] card-shadow-sm hover:card-shadow-md"
                                                                      >
                                                                             <div className="flex items-center gap-4 relative z-10">
                                                                                    <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                                                           <CreditCard className="w-6 h-6" />
                                                                                    </div>
                                                                                    <div>
                                                                                           <div className="font-bold text-lg text-foreground group-hover:text-blue-700 transition-colors">TRANSFERENCIA</div>
                                                                                           <div className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-0.5 group-hover:text-blue-500/60 italic transition-colors">Pago digital registrado</div>
                                                                                    </div>
                                                                             </div>
                                                                             <ArrowRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                                                      </button>
                                                               </div>
                                                        </div>

                                                        {loading && (
                                                               <div className="flex items-center justify-center gap-4 py-6 bg-slate-50 rounded-xl border border-dashed border-border animate-pulse">
                                                                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                                                      <span className="font-bold uppercase tracking-widest text-[11px] text-muted-foreground/60">Finalizando Operación...</span>
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
