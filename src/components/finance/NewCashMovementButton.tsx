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
                            size="lg"
                            className="w-full md:w-auto shadow-lg shadow-primary/20 rounded-xl px-6 flex items-center gap-2 font-bold tracking-tight"
                     >
                            <Plus className="w-5 h-5" />
                            <span>NUEVO MOVIMIENTO</span>
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
                                                 className="relative w-full max-w-lg bg-background sm:rounded-2xl border-t sm:border border-border shadow-2xl overflow-hidden flex flex-col"
                                          >
                                                 <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white sticky top-0 z-20">
                                                        <div className="flex items-center gap-4">
                                                               <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg text-primary border border-primary/20">
                                                                      <Wallet className="w-5 h-5" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-lg font-bold text-foreground">Caja Diaria</h3>
                                                                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">Registrar movimiento</p>
                                                               </div>
                                                        </div>
                                                        <button onClick={() => setIsOpen(false)} className="rounded-full w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                                                               <X className="w-5 h-5" />
                                                        </button>
                                                 </div>

                                                 <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                                        {/* Amount Input */}
                                                        <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center relative overflow-hidden shadow-inner">
                                                               <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                                                               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-2">Importe a Registrar</p>
                                                               <div className="flex items-center justify-center text-5xl font-bold tracking-tight text-foreground">
                                                                      <span className="text-xl text-muted-foreground/30 mr-1">$</span>
                                                                      <input
                                                                             type="number"
                                                                             autoFocus
                                                                             required
                                                                             value={formData.amount || ''}
                                                                             onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                                                             className="bg-transparent border-none focus:outline-none w-48 text-center tabular-nums placeholder:text-slate-200"
                                                                             placeholder="0"
                                                                      />
                                                               </div>
                                                        </div>

                                                        {/* Selectors */}
                                                        <div className="space-y-4">
                                                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                      <div className="space-y-1.5 px-1">
                                                                             <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Flujo</label>
                                                                             <div className="flex p-1 bg-muted rounded-xl border border-border">
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => setFormData({ ...formData, type: "INCOME" })}
                                                                                           className={cn(
                                                                                                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold uppercase text-[9px] tracking-widest transition-all",
                                                                                                  formData.type === "INCOME" ? "bg-white text-emerald-600 shadow-sm border border-border" : "text-muted-foreground hover:bg-white/50"
                                                                                           )}
                                                                                    >
                                                                                           <ArrowUpRight className="w-3.5 h-3.5" /> Ingreso
                                                                                    </button>
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => setFormData({ ...formData, type: "EXPENSE" })}
                                                                                           className={cn(
                                                                                                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold uppercase text-[9px] tracking-widest transition-all",
                                                                                                  formData.type === "EXPENSE" ? "bg-white text-rose-600 shadow-sm border border-border" : "text-muted-foreground hover:bg-white/50"
                                                                                           )}
                                                                                    >
                                                                                           <ArrowDownLeft className="w-3.5 h-3.5" /> Egreso
                                                                                    </button>
                                                                             </div>
                                                                      </div>

                                                                      <div className="space-y-1.5 px-1">
                                                                             <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Método</label>
                                                                             <div className="flex p-1 bg-muted rounded-xl border border-border">
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => setFormData({ ...formData, paymentMethod: "CASH" })}
                                                                                           className={cn(
                                                                                                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold uppercase text-[9px] tracking-widest transition-all",
                                                                                                  formData.paymentMethod === "CASH" ? "bg-white text-primary shadow-sm border border-border" : "text-muted-foreground hover:bg-white/50"
                                                                                           )}
                                                                                    >
                                                                                           <Banknote className="w-3.5 h-3.5" /> Efectivo
                                                                                    </button>
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => setFormData({ ...formData, paymentMethod: "TRANSFER" })}
                                                                                           className={cn(
                                                                                                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold uppercase text-[9px] tracking-widest transition-all",
                                                                                                  formData.paymentMethod === "TRANSFER" ? "bg-white text-primary shadow-sm border border-border" : "text-muted-foreground hover:bg-white/50"
                                                                                           )}
                                                                                    >
                                                                                           <CreditCard className="w-3.5 h-3.5" /> Digital
                                                                                    </button>
                                                                             </div>
                                                                      </div>
                                                               </div>

                                                               <div className="space-y-1.5 px-1">
                                                                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Concepto del Movimiento</label>
                                                                      <div className="relative group">
                                                                             <ReceiptText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                                             <input
                                                                                    type="text"
                                                                                    required
                                                                                    value={formData.concept}
                                                                                    onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                                                                                    placeholder="Ej: Venta de sifones sueltos, Pago flete..."
                                                                                    className="w-full h-12 bg-muted/50 border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm"
                                                                             />
                                                                      </div>
                                                               </div>
                                                        </div>

                                                        <div className="flex gap-3 pt-2">
                                                               <Button
                                                                      type="button"
                                                                      variant="ghost"
                                                                      className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest border border-border"
                                                                      onClick={() => setIsOpen(false)}
                                                               >
                                                                      Cancelar
                                                               </Button>
                                                               <Button
                                                                      type="submit"
                                                                      disabled={loading}
                                                                      className="flex-[2] h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all group"
                                                               >
                                                                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                                             <span className="flex items-center gap-2">
                                                                                    CONFIRMAR REGISTRO
                                                                                    <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
