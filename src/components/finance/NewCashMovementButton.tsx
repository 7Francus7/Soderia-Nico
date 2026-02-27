"use client";

import { useState } from "react";
import { Plus, X, Loader2, ArrowUpRight, ArrowDownLeft, Banknote, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCashMovement } from "@/actions/cash";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
                     toast.success("Movimiento registrado");
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
                            className="w-full md:w-auto px-8 h-14 rounded-2xl shadow-2xl bg-white hover:bg-white/90 text-black font-black tracking-widest group border-none transition-all hover:scale-105 active:scale-95"
                     >
                            <Plus className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                            NUEVO MOVIMIENTO
                     </Button>

                     {isOpen && (
                            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                                   <div className="bg-card w-full max-w-lg h-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-in-up">

                                          <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5">
                                                 <h3 className="text-2xl font-black tracking-tight uppercase italic">Registrar Movimiento</h3>
                                                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-2xl hover:bg-white/5">
                                                        <X className="w-6 h-6" />
                                                 </Button>
                                          </div>

                                          <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                                 {/* Massive Amount Input */}
                                                 <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Importe</p>
                                                        <div className="flex items-center justify-center text-6xl font-black tracking-tighter text-white">
                                                               <span className="text-2xl text-white/20 mt-2 mr-1">$</span>
                                                               <input
                                                                      type="number"
                                                                      autoFocus
                                                                      required
                                                                      value={formData.amount || ''}
                                                                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                                                      className="bg-transparent border-none focus:outline-none w-40 text-center"
                                                                      placeholder="0"
                                                               />
                                                        </div>
                                                 </div>

                                                 {/* Type & Method Tabs */}
                                                 <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-4">
                                                               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Tipo</label>
                                                               <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/10">
                                                                      <button
                                                                             type="button"
                                                                             onClick={() => setFormData({ ...formData, type: "INCOME" })}
                                                                             className={cn(
                                                                                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all",
                                                                                    formData.type === "INCOME" ? "bg-emerald-500 text-white shadow-lg" : "text-white/40 hover:bg-white/5 hover:text-white"
                                                                             )}
                                                                      >
                                                                             <ArrowUpRight className="w-4 h-4" /> Ingreso
                                                                      </button>
                                                                      <button
                                                                             type="button"
                                                                             onClick={() => setFormData({ ...formData, type: "EXPENSE" })}
                                                                             className={cn(
                                                                                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all",
                                                                                    formData.type === "EXPENSE" ? "bg-rose-500 text-white shadow-lg" : "text-white/40 hover:bg-white/5 hover:text-white"
                                                                             )}
                                                                      >
                                                                             <ArrowDownLeft className="w-4 h-4" /> Egreso
                                                                      </button>
                                                               </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Medio</label>
                                                               <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/10">
                                                                      <button
                                                                             type="button"
                                                                             onClick={() => setFormData({ ...formData, paymentMethod: "CASH" })}
                                                                             className={cn(
                                                                                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all",
                                                                                    formData.paymentMethod === "CASH" ? "bg-white text-black shadow-lg" : "text-white/40 hover:bg-white/5 hover:text-white"
                                                                             )}
                                                                      >
                                                                             <Banknote className="w-4 h-4" /> Efectivo
                                                                      </button>
                                                                      <button
                                                                             type="button"
                                                                             onClick={() => setFormData({ ...formData, paymentMethod: "TRANSFER" })}
                                                                             className={cn(
                                                                                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all",
                                                                                    formData.paymentMethod === "TRANSFER" ? "bg-white text-black shadow-lg" : "text-white/40 hover:bg-white/5 hover:text-white"
                                                                             )}
                                                                      >
                                                                             <CreditCard className="w-4 h-4" /> Digital
                                                                      </button>
                                                               </div>
                                                        </div>
                                                 </div>

                                                 {/* Concept Input */}
                                                 <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Concepto / Motivo</label>
                                                        <input
                                                               type="text"
                                                               required
                                                               value={formData.concept}
                                                               onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                                                               placeholder="Ej: Pago de flete, Venta de envases, etc."
                                                               className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20 text-white"
                                                        />
                                                 </div>

                                                 <div className="flex gap-4 pt-4">
                                                        <Button type="button" variant="ghost" className="flex-1 rounded-xl font-bold" onClick={() => setIsOpen(false)}>Cerrar</Button>
                                                        <Button type="submit" disabled={loading} className="flex-[2] h-14 rounded-2xl bg-white hover:bg-white/90 text-black font-black tracking-widest border-none transition-all active:scale-95 shadow-lg">
                                                               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "REGISTRAR"}
                                                        </Button>
                                                 </div>
                                          </form>
                                   </div>
                            </div>
                     )}
              </>
       );
}
