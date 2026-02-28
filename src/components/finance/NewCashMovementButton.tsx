"use strict";
"use client";

import { useState } from "react";
import { Plus, X, Loader2, ArrowUpRight, ArrowDownLeft, Banknote, CreditCard, Wallet, ReceiptText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCashMovement } from "@/actions/cash";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function NewCashMovementButton() {
       const [isOpen, setIsOpen] = useState(false);
       const [loading, setLoading] = useState(false);
       const [formData, setFormData] = useState({
              amount: 0,
              type: "INCOME",
              concept: "",
              paymentMethod: "CASH"
       });

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              if (formData.amount <= 0 || !formData.concept) {
                     toast.error("Importe y concepto son obligatorios");
                     return;
              }

              setLoading(true);
              const result = await createCashMovement(formData);
              if (result.success) {
                     toast.success("¡Movimiento registrado!");
                     setIsOpen(false);
                     setFormData({ amount: 0, type: "INCOME", concept: "", paymentMethod: "CASH" });
              } else {
                     toast.error("Error: " + result.error);
              }
              setLoading(false);
       };

       return (
              <>
                     <Button
                            onClick={() => setIsOpen(true)}
                            variant="premium"
                            size="lg"
                            className="w-full md:w-auto shadow-2xl group"
                     >
                            <Plus className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                            NUEVO MOVIMIENTO
                     </Button>

                     <AnimatePresence>
                            {isOpen && (
                                   <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 text-white overflow-hidden">
                                          {/* Backdrop */}
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setIsOpen(false)}
                                                 className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                                          />

                                          <motion.div
                                                 initial={{ y: 100, opacity: 0, scale: 0.9 }}
                                                 animate={{ y: 0, opacity: 1, scale: 1 }}
                                                 exit={{ y: 100, opacity: 0, scale: 0.9 }}
                                                 className="relative w-full max-w-xl bg-neutral-950/50 sm:rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col"
                                          >
                                                 <div className="p-10 pb-4 flex justify-between items-center relative z-10">
                                                        <div className="flex items-center gap-6">
                                                               <div className="w-16 h-16 bg-white text-black rounded-[2rem] flex items-center justify-center shadow-2xl shadow-white/20">
                                                                      <Wallet className="w-8 h-8" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Caja Diaria</h3>
                                                                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mt-3">Registro de movimiento</p>
                                                               </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full w-14 h-14 hover:bg-white/5 border border-white/5">
                                                               <X className="w-8 h-8" />
                                                        </Button>
                                                 </div>

                                                 <form onSubmit={handleSubmit} className="p-10 space-y-10 relative z-10">
                                                        {/* Massive Amount Display */}
                                                        <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 text-center relative overflow-hidden group">
                                                               <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Importe a Registrar</p>
                                                               <div className="flex items-center justify-center text-8xl font-black tracking-tighter text-white">
                                                                      <span className="text-3xl text-white/20 mt-4 mr-2 font-mono">$</span>
                                                                      <input
                                                                             type="number"
                                                                             autoFocus
                                                                             required
                                                                             value={formData.amount || ''}
                                                                             onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                                                             className="bg-transparent border-none focus:outline-none w-64 text-center tabular-nums"
                                                                             placeholder="0"
                                                                      />
                                                               </div>
                                                        </div>

                                                        {/* Tabs for Type and Method */}
                                                        <div className="space-y-10">
                                                               <div className="grid grid-cols-2 gap-10">
                                                                      <div className="space-y-4">
                                                                             <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-6">Dirección Flujo</label>
                                                                             <div className="flex p-2 bg-black/60 rounded-[2rem] border border-white/10">
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => setFormData({ ...formData, type: "INCOME" })}
                                                                                           className={cn(
                                                                                                  "flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all",
                                                                                                  formData.type === "INCOME" ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" : "text-white/30 hover:bg-white/5"
                                                                                           )}
                                                                                    >
                                                                                           <ArrowUpRight className="w-4 h-4" /> Ingreso
                                                                                    </button>
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => setFormData({ ...formData, type: "EXPENSE" })}
                                                                                           className={cn(
                                                                                                  "flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all",
                                                                                                  formData.type === "EXPENSE" ? "bg-rose-500 text-white shadow-xl shadow-rose-500/20" : "text-white/30 hover:bg-white/5"
                                                                                           )}
                                                                                    >
                                                                                           <ArrowDownLeft className="w-4 h-4" /> Egreso
                                                                                    </button>
                                                                             </div>
                                                                      </div>

                                                                      <div className="space-y-4">
                                                                             <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-6">Medio de Pago</label>
                                                                             <div className="flex p-2 bg-black/60 rounded-[2rem] border border-white/10">
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => setFormData({ ...formData, paymentMethod: "CASH" })}
                                                                                           className={cn(
                                                                                                  "flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all",
                                                                                                  formData.paymentMethod === "CASH" ? "bg-white text-black shadow-xl shadow-white/10" : "text-white/30 hover:bg-white/5"
                                                                                           )}
                                                                                    >
                                                                                           <Banknote className="w-4 h-4" /> Efectivo
                                                                                    </button>
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => setFormData({ ...formData, paymentMethod: "TRANSFER" })}
                                                                                           className={cn(
                                                                                                  "flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all",
                                                                                                  formData.paymentMethod === "TRANSFER" ? "bg-white text-black shadow-xl shadow-white/10" : "text-white/30 hover:bg-white/5"
                                                                                           )}
                                                                                    >
                                                                                           <CreditCard className="w-4 h-4" /> Digital
                                                                                    </button>
                                                                             </div>
                                                                      </div>
                                                               </div>

                                                               <div className="space-y-4">
                                                                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-6">Concepto del Movimiento</label>
                                                                      <div className="relative group">
                                                                             <ReceiptText className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-white transition-colors" />
                                                                             <input
                                                                                    type="text"
                                                                                    required
                                                                                    value={formData.concept}
                                                                                    onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                                                                                    placeholder="Ej: Venta de sifones sueltos, Pago flete..."
                                                                                    className="w-full h-20 bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 font-bold text-xl text-white focus:outline-none focus:ring-4 focus:ring-white/10 transition-all placeholder:text-white/10 tabular-nums"
                                                                             />
                                                                      </div>
                                                               </div>
                                                        </div>

                                                        <div className="flex gap-6 pt-6">
                                                               <Button
                                                                      type="button"
                                                                      variant="ghost"
                                                                      className="flex-1 h-20 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white/5 text-white/30 hover:text-white"
                                                                      onClick={() => setIsOpen(false)}
                                                               >
                                                                      Cerrar
                                                               </Button>
                                                               <Button
                                                                      type="submit"
                                                                      disabled={loading}
                                                                      variant="action"
                                                                      size="xl"
                                                                      className="flex-[2] shadow-2xl shadow-primary/40 group active:scale-95"
                                                               >
                                                                      {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                                                                             <span className="flex items-center gap-3">
                                                                                    REGISTRAR MOVIMIENTO
                                                                                    <Check className="w-7 h-7 group-hover:scale-125 transition-transform" />
                                                                             </span>
                                                                      )}
                                                               </Button>
                                                        </div>
                                                 </form>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </>
       );
}
