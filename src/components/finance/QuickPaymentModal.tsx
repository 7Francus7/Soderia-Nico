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
              const result = await registerPayment(client.id, amount, "Pago rápido desde lista de deudores");
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
                            <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 overflow-hidden">
                                   {/* Backdrop */}
                                   <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          onClick={onClose}
                                          className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
                                   />

                                   {/* Modal Container */}
                                   <motion.div
                                          initial={{ y: 50, opacity: 0, scale: 0.95 }}
                                          animate={{ y: 0, opacity: 1, scale: 1 }}
                                          exit={{ y: 50, opacity: 0, scale: 0.95 }}
                                          className="relative bg-neutral-900 w-full max-w-md rounded-t-[3rem] sm:rounded-[3.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col text-white"
                                   >
                                          {/* Header */}
                                          <div className="p-10 pb-6 flex justify-between items-center relative z-10">
                                                 <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                                                               <DollarSign className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Caja Rápida</h3>
                                                               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mt-3">{client.name}</p>
                                                        </div>
                                                 </div>
                                                 <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-14 h-14 hover:bg-white/5 border border-white/5">
                                                        <X className="w-8 h-8" />
                                                 </Button>
                                          </div>

                                          <div className="p-10 space-y-10 relative z-10">
                                                 {/* High Impact Amount Input */}
                                                 <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 text-center relative overflow-hidden group">
                                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500 animate-pulse" />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Monto a Percibir</p>
                                                        <div className="flex items-center justify-center text-8xl font-black tracking-tighter text-white">
                                                               <span className="text-3xl text-emerald-500/40 mt-4 mr-2">$</span>
                                                               <input
                                                                      type="number"
                                                                      autoFocus
                                                                      value={amount || ''}
                                                                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                                                      className="bg-transparent border-none focus:outline-none w-64 text-center tabular-nums"
                                                                      placeholder="0"
                                                               />
                                                        </div>

                                                        <button
                                                               onClick={setFullPayment}
                                                               className="mt-8 px-8 py-4 rounded-[1.5rem] bg-white/5 text-emerald-500 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all active:scale-95 border border-emerald-500/10"
                                                        >
                                                               Liquidar Deuda: ${client.balance.toLocaleString()}
                                                        </button>
                                                 </div>

                                                 <div className="flex gap-6">
                                                        <Button
                                                               variant="ghost"
                                                               className="flex-1 h-20 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white/5 text-white/30 hover:text-white"
                                                               onClick={onClose}
                                                        >
                                                               Cerrar
                                                        </Button>
                                                        <Button
                                                               disabled={loading || amount <= 0}
                                                               onClick={handlePayment}
                                                               variant="action"
                                                               size="xl"
                                                               className="flex-[2] shadow-2xl shadow-emerald-500/20 active:scale-95 group"
                                                        >
                                                               {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                                                                      <span className="flex items-center gap-3">
                                                                             CONFIRMAR
                                                                             <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
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
