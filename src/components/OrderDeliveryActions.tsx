"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Truck, CheckCircle, X, Banknote, CreditCard, ArrowLeftRight, Loader2 } from "lucide-react";
import { deliverOrder } from "@/actions/deliveries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OrderDeliveryActions({ order }: { order: any }) {
       const [isOpen, setIsOpen] = useState(false);
       const [returnedBottles, setReturnedBottles] = useState(0);
       const [loading, setLoading] = useState(false);

       if (order.status === "DELIVERED") {
              return (
                     <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20">
                            <CheckCircle className="w-5 h-5" />
                            Entregado
                     </div>
              );
       }

       const handleDeliver = async (method: string) => {
              setLoading(true);
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
              setLoading(false);
       };

       return (
              <>
                     <Button
                            onClick={() => setIsOpen(true)}
                            className="w-full sm:w-auto px-12 h-16 rounded-[1.5rem] bg-slate-900 dark:bg-white text-white dark:text-black font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all"
                     >
                            <Truck className="w-6 h-6 mr-3" />
                            ENTREGAR
                     </Button>

                     {isOpen && (
                            <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                                   <div className="bg-card w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-in-up">

                                          <div className="p-8 pb-4 flex justify-between items-center">
                                                 <h3 className="text-2xl font-black italic uppercase tracking-tighter">Cobro y Entrega</h3>
                                                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-2xl">
                                                        <X className="w-6 h-6" />
                                                 </Button>
                                          </div>

                                          <div className="p-8 space-y-8">
                                                 {/* Massive Total Display */}
                                                 <div className="bg-muted/10 border border-white/5 rounded-[2rem] p-8 text-center">
                                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Total a cobrar</p>
                                                        <p className="text-5xl font-black tracking-tighter">${order.totalAmount.toLocaleString()}</p>
                                                 </div>

                                                 {/* Bottles Counter */}
                                                 <div className="space-y-3">
                                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Envases Retornados</label>
                                                        <div className="flex items-center gap-4">
                                                               <Button
                                                                      variant="outline"
                                                                      className="w-20 h-20 rounded-[1.5rem] border-white/10 text-3xl font-black"
                                                                      onClick={() => setReturnedBottles(Math.max(0, returnedBottles - 1))}
                                                               >-</Button>
                                                               <div className="flex-1 h-20 bg-muted/10 border border-white/5 rounded-[1.5rem] flex items-center justify-center text-4xl font-black">
                                                                      {returnedBottles}
                                                               </div>
                                                               <Button
                                                                      variant="outline"
                                                                      className="w-20 h-20 rounded-[1.5rem] border-white/10 text-3xl font-black"
                                                                      onClick={() => setReturnedBottles(returnedBottles + 1)}
                                                               >+</Button>
                                                        </div>
                                                 </div>

                                                 {/* Payment Methods - FAT BUTTONS */}
                                                 <div className="grid grid-cols-1 gap-4">
                                                        <button
                                                               disabled={loading}
                                                               onClick={() => handleDeliver("CASH")}
                                                               className="flex items-center gap-4 p-6 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-left active:scale-[0.98]"
                                                        >
                                                               <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                                                      <Banknote className="w-6 h-6" />
                                                               </div>
                                                               <div>
                                                                      <div className="font-black text-lg leading-tight uppercase tracking-tight">Efectivo</div>
                                                                      <div className="text-sm font-bold opacity-60">Ingresa a caja</div>
                                                               </div>
                                                        </button>

                                                        <button
                                                               disabled={loading}
                                                               onClick={() => handleDeliver("CURRENT_ACCOUNT")}
                                                               className="flex items-center gap-4 p-6 rounded-[1.5rem] bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all text-left active:scale-[0.98]"
                                                        >
                                                               <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shrink-0">
                                                                      <ArrowLeftRight className="w-6 h-6" />
                                                               </div>
                                                               <div>
                                                                      <div className="font-black text-lg leading-tight uppercase tracking-tight">Cuenta Corriente</div>
                                                                      <div className="text-sm font-bold opacity-60">Suma deuda al cliente</div>
                                                               </div>
                                                        </button>

                                                        <button
                                                               disabled={loading}
                                                               onClick={() => handleDeliver("TRANSFER")}
                                                               className="flex items-center gap-4 p-6 rounded-[1.5rem] bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all text-left active:scale-[0.98]"
                                                        >
                                                               <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shrink-0">
                                                                      <CreditCard className="w-6 h-6" />
                                                               </div>
                                                               <div>
                                                                      <div className="font-black text-lg leading-tight uppercase tracking-tight">Transferencia</div>
                                                                      <div className="text-sm font-bold opacity-60">Cobro digital</div>
                                                               </div>
                                                        </button>
                                                 </div>

                                                 {loading && (
                                                        <div className="flex items-center justify-center gap-3 text-muted-foreground font-black animate-pulse">
                                                               <Loader2 className="w-5 h-5 animate-spin" />
                                                               PROCESANDO...
                                                        </div>
                                                 )}
                                          </div>
                                   </div>
                            </div>
                     )}
              </>
       );
}
