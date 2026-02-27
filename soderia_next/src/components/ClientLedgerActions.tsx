"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Banknote, PlusCircle, X, Loader2, ArrowLeftRight } from "lucide-react";
import { registerPayment, registerCharge } from "@/actions/clients";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ClientLedgerActions({ client }: { client: any }) {
       const [modal, setModal] = useState<"payment" | "charge" | null>(null);
       const [loading, setLoading] = useState(false);
       const [amount, setAmount] = useState<number>(0);
       const [description, setDescription] = useState("");

       const handleAction = async () => {
              if (amount <= 0) {
                     toast.error("El monto debe ser mayor a 0");
                     return;
              }

              setLoading(true);
              const action = modal === "payment" ? registerPayment : registerCharge;
              const result = await action(client.id, amount, description);

              if (result.success) {
                     toast.success(modal === "payment" ? "Pago registrado" : "Cargo registrado");
                     setModal(null);
                     setAmount(0);
                     setDescription("");
              } else {
                     toast.error("Error: " + result.error);
              }
              setLoading(false);
       };

       return (
              <>
                     <div className="flex gap-4 w-full md:w-auto">
                            <Button
                                   variant="outline"
                                   onClick={() => setModal("charge")}
                                   className="flex-1 md:flex-none border-rose-500/20 text-rose-500 hover:bg-rose-500/10 h-14 rounded-2xl font-black uppercase tracking-widest text-xs"
                            >
                                   <PlusCircle className="w-4 h-4 mr-2" />
                                   CARGAR DEUDA
                            </Button>
                            <Button
                                   onClick={() => setModal("payment")}
                                   className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20"
                            >
                                   <Banknote className="w-5 h-5 mr-2" />
                                   REGISTRAR PAGO
                            </Button>
                     </div>

                     {modal && (
                            <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                                   <div className="bg-card w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-in-up">

                                          <div className="p-8 pb-4 flex justify-between items-center">
                                                 <h3 className="text-2xl font-black italic uppercase tracking-tighter">
                                                        {modal === "payment" ? "Registrar Pago" : "Cargar Concepto / Deuda"}
                                                 </h3>
                                                 <Button variant="ghost" size="icon" onClick={() => setModal(null)} className="rounded-2xl">
                                                        <X className="w-6 h-6" />
                                                 </Button>
                                          </div>

                                          <div className="p-8 space-y-6">
                                                 <div className="space-y-4">
                                                        <div className="bg-muted/10 p-6 rounded-3xl border border-white/5 text-center">
                                                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Importe</p>
                                                               <div className="flex items-center justify-center text-5xl font-black tracking-tighter">
                                                                      <span className="text-2xl opacity-30 mt-2 mr-1">$</span>
                                                                      <input
                                                                             type="number"
                                                                             autoFocus
                                                                             value={amount || ''}
                                                                             onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                                                             className="bg-transparent border-none focus:outline-none w-32 text-center"
                                                                             placeholder="0"
                                                                      />
                                                               </div>
                                                        </div>

                                                        <div className="space-y-2 px-2">
                                                               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Concepto / Descripción</label>
                                                               <input
                                                                      type="text"
                                                                      value={description}
                                                                      onChange={(e) => setDescription(e.target.value)}
                                                                      placeholder={modal === "payment" ? "Ej: Saldo mes de enero" : "Ej: Concepto varios"}
                                                                      className="w-full h-14 bg-muted/20 border border-white/5 rounded-2xl px-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                               />
                                                        </div>
                                                 </div>

                                                 <div className="pt-4 flex gap-4">
                                                        <Button variant="ghost" onClick={() => setModal(null)} className="flex-1">Cerrar</Button>
                                                        <Button
                                                               disabled={loading || amount <= 0}
                                                               onClick={handleAction}
                                                               className={cn(
                                                                      "flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl",
                                                                      modal === "payment" ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20" : "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
                                                               )}
                                                        >
                                                               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (modal === "payment" ? "CONFIRMAR PAGO" : "CONFIRMAR CARGO")}
                                                        </Button>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     )}
              </>
       );
}
