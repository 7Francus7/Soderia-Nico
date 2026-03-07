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
       const [method, setMethod] = useState<string>("CASH");
       const [notes, setNotes] = useState("");
       const [loading, setLoading] = useState(false);

       if (!client) return null;

       const handlePayment = async () => {
              if (amount <= 0) return;
              setLoading(true);
              const result = await registerPayment({
                     clientId: client.id,
                     amount,
                     description: notes || "Pago rápido desde administración",
                     paymentMethod: method,
                     idempotencyKey: crypto.randomUUID()
              });
              if (result.success) {
                     toast.success("Pago registrado con éxito");
                     onClose();
              } else {
                     toast.error("Error al registrar: " + result.error);
              }
              setLoading(false);
       };

       const quickAmounts = [500, 1000, 2000, 5000];
       const resultingBalance = client.balance - amount;

       return (
              <AnimatePresence>
                     {client && (
                            <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                                   <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          onClick={onClose}
                                          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                   />

                                   <motion.div
                                          initial={{ y: "100%" }}
                                          animate={{ y: 0 }}
                                          exit={{ y: "100%" }}
                                          className="relative bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl border-t sm:border border-border shadow-2xl overflow-hidden flex flex-col"
                                   >
                                          <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white">
                                                 <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100">
                                                               <DollarSign className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-base font-bold text-foreground leading-none">Registrar Cobranza</h3>
                                                               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">{client.name}</p>
                                                        </div>
                                                 </div>
                                                 <button onClick={onClose} className="rounded-full w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                                                        <X className="w-4 h-4" />
                                                 </button>
                                          </div>

                                          <div className="p-6 space-y-6">
                                                 {/* Amount Input Section */}
                                                 <div className="space-y-3">
                                                        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center shadow-inner">
                                                               <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-1">Monto a Cobrar</p>
                                                               <div className="flex items-center justify-center text-4xl font-black tracking-tight text-foreground">
                                                                      <span className="text-lg text-muted-foreground/30 mr-1">$</span>
                                                                      <input
                                                                             type="number"
                                                                             autoFocus
                                                                             value={amount || ''}
                                                                             onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                                                             className="bg-transparent border-none focus:outline-none w-32 text-center tabular-nums placeholder:text-slate-200"
                                                                             placeholder="0"
                                                                      />
                                                               </div>
                                                               <div className="mt-3 flex justify-center">
                                                                      <button
                                                                             onClick={() => setAmount(client.balance)}
                                                                             className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-all border border-emerald-200"
                                                                      >
                                                                             Total: ${client.balance.toLocaleString()}
                                                                      </button>
                                                               </div>
                                                        </div>

                                                        {/* Quick selectors */}
                                                        <div className="grid grid-cols-4 gap-2">
                                                               {quickAmounts.map(q => (
                                                                      <button
                                                                             key={q}
                                                                             onClick={() => setAmount(prev => prev + q)}
                                                                             className="h-10 rounded-xl border border-border bg-white text-[10px] font-bold hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm"
                                                                      >
                                                                             +${q}
                                                                      </button>
                                                               ))}
                                                        </div>
                                                 </div>

                                                 {/* Payment Method */}
                                                 <div className="space-y-2">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">Método de Pago</p>
                                                        <div className="grid grid-cols-2 gap-2">
                                                               {[
                                                                      { id: "CASH", label: "Efectivo" },
                                                                      { id: "TRANSFER", label: "Transferencia" }
                                                               ].map(m => (
                                                                      <button
                                                                             key={m.id}
                                                                             onClick={() => setMethod(m.id)}
                                                                             className={cn(
                                                                                    "h-11 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm",
                                                                                    method === m.id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-muted-foreground border-border hover:bg-slate-50"
                                                                             )}
                                                                      >
                                                                             {m.label}
                                                                      </button>
                                                               ))}
                                                        </div>
                                                 </div>

                                                 {/* Note */}
                                                 <div className="space-y-2">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">Nota / Referencia (Opcional)</p>
                                                        <input
                                                               type="text"
                                                               placeholder="Ej: Pago mes de Marzo..."
                                                               value={notes}
                                                               onChange={(e) => setNotes(e.target.value)}
                                                               className="w-full h-11 bg-slate-50 border border-border rounded-xl px-4 text-xs focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                                                        />
                                                 </div>

                                                 {/* Resulting Balance Preview */}
                                                 <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center">
                                                        <div className="space-y-0.5">
                                                               <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Saldo Resultante</p>
                                                               <p className="text-xl font-black tabular-nums tracking-tighter">${resultingBalance.toLocaleString()}</p>
                                                        </div>
                                                        <div className="text-right">
                                                               {resultingBalance <= 0 && (
                                                                      <div className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                                                                             <CheckCircle className="w-2.5 h-2.5" /> Cuenta al día
                                                                      </div>
                                                               )}
                                                        </div>
                                                 </div>

                                                 <Button
                                                        disabled={loading || amount <= 0}
                                                        onClick={handlePayment}
                                                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 rounded-2xl font-black text-xs uppercase tracking-[0.2em] active:scale-95 group transition-all"
                                                 >
                                                        {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : (
                                                               <span className="flex items-center gap-2">
                                                                      Confirmar Cobranza
                                                                      <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                                                               </span>
                                                        )}
                                                 </Button>
                                          </div>
                                   </motion.div>
                            </div>
                     )}
              </AnimatePresence>
       );
}

