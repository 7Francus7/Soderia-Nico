"use strict";
"use client";

import { useState } from "react";
import { X, DollarSign, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerPayment } from "@/actions/clients";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickPaymentModal({ client, onClose }: { client: any; onClose: () => void }) {
       const [amount, setAmount] = useState<number>(0);
       const [loading, setLoading] = useState(false);

       if (!client) return null;

       const handlePayment = async () => {
              if (amount <= 0) return;
              setLoading(true);
              const result = await registerPayment({
                     clientId: client.id,
                     amount,
                     description: "Pago rápido desde lista de deudores",
                     paymentMethod: "CASH"
              });
              if (result.success) {
                     toast.success("Pago registrado con éxito");
                     onClose();
              } else {
                     toast.error("Error al registrar: " + result.error);
              }
              setLoading(false);
       };

       const setFullPayment = () => setAmount(client.balance);

       return (
              <AnimatePresence>
                     {client && (
                            <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                                   {/* Backdrop */}
                                   <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          onClick={onClose}
                                          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                   />

                                   {/* Modal Container */}
                                   <motion.div
                                          initial={{ y: "100%" }}
                                          animate={{ y: 0 }}
                                          exit={{ y: "100%" }}
                                          className="relative bg-background w-full max-w-md rounded-t-2xl sm:rounded-2xl border-t sm:border border-border shadow-2xl overflow-hidden flex flex-col"
                                   >
                                          {/* Header */}
                                          <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white sticky top-0 z-20">
                                                 <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                                                               <DollarSign className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-lg font-bold text-foreground leading-none">Caja Rápida</h3>
                                                               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">{client.name}</p>
                                                        </div>
                                                 </div>
                                                 <button onClick={onClose} className="rounded-full w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                                                        <X className="w-5 h-5" />
                                                 </button>
                                          </div>

                                          <div className="p-6 space-y-6">
                                                 {/* Amount Input */}
                                                 <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center relative overflow-hidden shadow-inner">
                                                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-2">Monto a Percibir</p>
                                                        <div className="flex items-center justify-center text-5xl font-bold tracking-tight text-foreground">
                                                               <span className="text-xl text-muted-foreground/30 mr-1">$</span>
                                                               <input
                                                                      type="number"
                                                                      autoFocus
                                                                      value={amount || ''}
                                                                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                                                      className="bg-transparent border-none focus:outline-none w-48 text-center tabular-nums placeholder:text-slate-200"
                                                                      placeholder="0"
                                                               />
                                                        </div>

                                                        <button
                                                               onClick={setFullPayment}
                                                               className="mt-6 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95 border border-emerald-100"
                                                        >
                                                               Liquidar Deuda: ${client.balance.toLocaleString()}
                                                        </button>
                                                 </div>

                                                 <div className="flex gap-3 pt-2">
                                                        <Button
                                                               variant="ghost"
                                                               className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest border border-border"
                                                               onClick={onClose}
                                                        >
                                                               Cerrar
                                                        </Button>
                                                        <Button
                                                               disabled={loading || amount <= 0}
                                                               onClick={handlePayment}
                                                               className="flex-[2] h-12 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 group"
                                                        >
                                                               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                                      <span className="flex items-center gap-2">
                                                                             CONFIRMAR PAGO
                                                                             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                                      </span>
                                                               )}
                                                        </Button>
                                                 </div>
                                          </div>
                                   </motion.div>
                            </div>
                     )}
              </AnimatePresence>
       );
}
