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
                     toast.error("Importe y concepto son obligatorios", {
                            style: { borderRadius: '1rem', fontWeight: '800' }
                     });
                     return;
              }

              setLoading(true);
              const result = await createCashMovement(formData);
              if (result.success) {
                     toast.success("¡Movimiento registrado!", {
                            style: { borderRadius: '1rem', fontWeight: '800' }
                     });
                     setIsOpen(false);
                     setFormData({ amount: 0, type: "INCOME", concept: "", paymentMethod: "CASH" });
              } else {
                     toast.error("Error: " + result.error, {
                            style: { borderRadius: '1rem', fontWeight: '800' }
                     });
              }
              setLoading(false);
       };

       return (
              <>
                     <Button
                            onClick={() => setIsOpen(true)}
                            className="h-14 bg-primary text-white shadow-xl shadow-primary/25 rounded-2xl px-10 flex items-center gap-3 active:scale-95 transition-all text-sm font-black uppercase tracking-widest"
                     >
                            <Plus className="w-5.5 h-5.5 stroke-[3px]" />
                            <span>Nuevo Movimiento</span>
                     </Button>

                     <AnimatePresence>
                            {isOpen && (
                                   <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 lg:p-10">
                                          {/* Backdrop Overlay */}
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setIsOpen(false)}
                                                 className="absolute inset-0 bg-black/40 backdrop-blur-[8px]"
                                          />

                                          {/* iOS Style Modal Container */}
                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 transition={{ type: "spring", damping: 30, stiffness: 300, mass: 1 }}
                                                 className="relative w-full max-w-xl h-[92vh] lg:h-auto bg-white rounded-t-[3rem] lg:rounded-[3rem] shadow-[0_-25px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
                                          >
                                                 {/* Swipe Handle & Header */}
                                                 <div className="flex flex-col items-center pt-3 pb-8 sticky top-0 bg-white/95 backdrop-blur-md z-30">
                                                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-8" />
                                                        <div className="w-full px-10 flex items-center justify-between">
                                                               <div className="flex flex-col">
                                                                      <h3 className="text-3xl font-black text-foreground tracking-tighter">Nueva Entrada</h3>
                                                                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Caja Diaria</span>
                                                               </div>
                                                               <button
                                                                      onClick={() => setIsOpen(false)}
                                                                      className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-transform shadow-sm"
                                                               >
                                                                      <X className="w-6 h-6" />
                                                               </button>
                                                        </div>
                                                 </div>

                                                 <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 pb-32">
                                                        <div className="space-y-10">
                                                               {/* Amount Input Section */}
                                                               <div className="bg-slate-50/50 border-2 border-slate-50 p-12 lg:p-16 rounded-[3rem] text-center relative overflow-hidden shadow-inner group">
                                                                      <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20 group-focus-within:bg-primary transition-colors" />
                                                                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 group-focus-within:text-primary transition-colors">Importe a Registrar ($)</p>
                                                                      <div className="flex items-center justify-center text-7xl font-black tracking-tighter text-foreground tabular-nums">
                                                                             <input
                                                                                    type="number"
                                                                                    autoFocus
                                                                                    required
                                                                                    value={formData.amount || ''}
                                                                                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                                                                    className="bg-transparent border-none focus:outline-none w-full text-center placeholder:text-slate-200"
                                                                                    placeholder="0.00"
                                                                             />
                                                                      </div>
                                                               </div>

                                                               {/* Selectors Area */}
                                                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                      <div className="space-y-3 px-1">
                                                                             <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Dirección del Flujo</label>
                                                                             <div className="flex p-1.5 bg-slate-50/80 rounded-[1.5rem] border border-slate-100 shadow-inner">
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => setFormData({ ...formData, type: "INCOME" })}
                                                                                           className={cn(
                                                                                                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.2rem] font-black uppercase text-[10px] tracking-widest transition-all",
                                                                                                  formData.type === "INCOME" ? "bg-white text-emerald-500 shadow-xl shadow-emerald-500/10 border border-emerald-100/50" : "text-slate-400 hover:bg-white/50"
                                                                                           )}
                                                                                    >
                                                                                           <ArrowUpRight className="w-4 h-4" /> Ingreso
                                                                                    </button>
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => setFormData({ ...formData, type: "EXPENSE" })}
                                                                                           className={cn(
                                                                                                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.2rem] font-black uppercase text-[10px] tracking-widest transition-all",
                                                                                                  formData.type === "EXPENSE" ? "bg-white text-rose-500 shadow-xl shadow-rose-500/10 border border-rose-100/50" : "text-slate-400 hover:bg-white/50"
                                                                                           )}
                                                                                    >
                                                                                           <ArrowDownLeft className="w-4 h-4" /> Egreso
                                                                                    </button>
                                                                             </div>
                                                                      </div>

                                                                      <div className="space-y-3 px-1">
                                                                             <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Forma de Pago</label>
                                                                             <div className="flex p-1.5 bg-slate-50/80 rounded-[1.5rem] border border-slate-100 shadow-inner">
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => setFormData({ ...formData, paymentMethod: "CASH" })}
                                                                                           className={cn(
                                                                                                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.2rem] font-black uppercase text-[10px] tracking-widest transition-all",
                                                                                                  formData.paymentMethod === "CASH" ? "bg-white text-primary shadow-xl shadow-primary/10 border border-primary/20" : "text-slate-400 hover:bg-white/50"
                                                                                           )}
                                                                                    >
                                                                                           <Banknote className="w-4 h-4" /> Efectivo
                                                                                    </button>
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => setFormData({ ...formData, paymentMethod: "TRANSFER" })}
                                                                                           className={cn(
                                                                                                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.2rem] font-black uppercase text-[10px] tracking-widest transition-all",
                                                                                                  formData.paymentMethod === "TRANSFER" ? "bg-white text-primary shadow-xl shadow-primary/10 border border-primary/20" : "text-slate-400 hover:bg-white/50"
                                                                                           )}
                                                                                    >
                                                                                           <CreditCard className="w-4 h-4" /> Digital
                                                                                    </button>
                                                                             </div>
                                                                      </div>
                                                               </div>

                                                               {/* Concept Info Section */}
                                                               <div className="space-y-4 pt-4">
                                                                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
                                                                             <ReceiptText className="w-4 h-4" /> Concepto Detallado
                                                                      </label>
                                                                      <div className="relative group">
                                                                             <input
                                                                                    type="text"
                                                                                    required
                                                                                    value={formData.concept}
                                                                                    onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                                                                                    placeholder="Ej: Pago de impuestos, Venta mayorista..."
                                                                                    className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-[2rem] px-8 text-base font-bold text-foreground placeholder:text-slate-200 focus:outline-none focus:border-primary/20 focus:bg-white transition-all shadow-inner"
                                                                             />
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </form>

                                                 {/* Action Bar Sticky iOS Style */}
                                                 <div className="absolute bottom-0 left-0 right-0 p-10 pt-4 pb-14 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40 flex gap-4">
                                                        <Button
                                                               type="button"
                                                               variant="ghost"
                                                               className="h-16 flex-1 rounded-3xl text-sm font-black uppercase tracking-widest text-slate-400 border border-slate-100 active:bg-slate-50 active:scale-95 transition-all outline-none"
                                                               onClick={() => setIsOpen(false)}
                                                        >
                                                               Cancelar
                                                        </Button>
                                                        <Button
                                                               type="submit"
                                                               onClick={handleSubmit}
                                                               disabled={loading}
                                                               className="h-16 flex-[2] bg-primary text-white shadow-2xl shadow-primary/30 rounded-3xl font-black text-sm uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center gap-3"
                                                        >
                                                               {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                                                      <>
                                                                             <Check className="w-6 h-6 stroke-[3px]" />
                                                                             Procesar Pago
                                                                      </>
                                                               )}
                                                        </Button>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </>
       );
}
