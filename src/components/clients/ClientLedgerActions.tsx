"use strict";
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Banknote, PlusCircle, X, Loader2, FileText, Share2, ArrowUpRight, ArrowDownLeft, Info, Check, ArrowRight, Wallet, History, MessageCircle } from "lucide-react";
import { registerPayment, registerCharge } from "@/actions/clients";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLedgerActions({ client }: { client: any }) {
       const [modal, setModal] = useState<"payment" | "charge" | "summary" | null>(null);
       const [loading, setLoading] = useState(false);
       const [amount, setAmount] = useState<number>(0);
       const [description, setDescription] = useState("");

       const handleAction = async () => {
              if (amount <= 0) {
                     toast.error("El monto debe ser mayor a 0", {
                            style: { borderRadius: '1rem', fontWeight: '800' }
                     });
                     return;
              }

              setLoading(true);
              try {
                     const action = modal === "payment" ? registerPayment : registerCharge;
                     const result = await action(client.id, amount, description);

                     if (result.success) {
                            toast.success(modal === "payment" ? "¡Pago registrado con éxito!" : "Cargo registrado", {
                                   style: { borderRadius: '1rem', fontWeight: '800' }
                            });
                            setModal(null);
                            setAmount(0);
                            setDescription("");
                     } else {
                            toast.error("Error: " + result.error, {
                                   style: { borderRadius: '1rem', fontWeight: '800' }
                            });
                     }
              } catch (e) {
                     toast.error("Error en la conexión", {
                            style: { borderRadius: '1rem', fontWeight: '800' }
                     });
              } finally {
                     setLoading(false);
              }
       };

       const handleWhatsAppSummary = () => {
              const date = new Date().toLocaleDateString();
              let message = `*RESUMEN DE CUENTA - SODERÍA NICO*\n`;
              message += `*Cliente:* ${client.name}\n`;
              message += `*Fecha:* ${date}\n`;
              message += `--------------------------------\n`;
              message += `*SALDO ACTUAL: $${client.balance.toLocaleString()}*\n`;
              message += `*Envases en posesión:* ${client.bottlesBalance} unid.\n`;

              if (client.transactions?.length > 0) {
                     message += `\n*Últimos movimientos:*\n`;
                     client.transactions.slice(0, 5).forEach((tx: any) => {
                            const txDate = new Date(tx.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
                            const sign = tx.type === "DEBIT" ? "(+)" : "(-)";
                            message += `• ${txDate}: ${tx.concept} ${sign} $${tx.amount.toLocaleString()}\n`;
                     });
              }

              message += `--------------------------------\n`;
              message += `_Por favor, verifique su saldo. Muchas gracias._`;

              const url = `https://wa.me/${client.phone?.replace(/[^0-9]/g, '') || ''}?text=${encodeURIComponent(message)}`;
              window.open(url, '_blank');
              toast.success("Resumen compartido", {
                     style: { borderRadius: '1rem', fontWeight: '800' }
              });
       };

       return (
              <>
                     <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <Button
                                   variant="ghost"
                                   onClick={() => setModal("summary")}
                                   className="h-14 flex-1 md:flex-none px-6 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                            >
                                   <FileText className="w-5 h-5 mr-3 opacity-40" />
                                   Resumen
                            </Button>
                            <Button
                                   variant="ghost"
                                   onClick={() => setModal("charge")}
                                   className="h-14 flex-1 md:flex-none px-6 rounded-2xl bg-rose-50 border border-rose-100/50 text-rose-500 hover:bg-rose-100 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                            >
                                   <PlusCircle className="w-5 h-5 mr-3" />
                                   Cargar Importe
                            </Button>
                            <Button
                                   onClick={() => setModal("payment")}
                                   className="h-14 flex-1 md:flex-none px-10 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/25 active:scale-95 transition-all"
                            >
                                   <Banknote className="w-5 h-5 mr-3" />
                                   Cobrar
                            </Button>
                     </div>

                     <AnimatePresence>
                            {/* Payment / Charge Modal */}
                            {(modal === "payment" || modal === "charge") && (
                                   <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 lg:p-10">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setModal(null)}
                                                 className="absolute inset-0 bg-black/40 backdrop-blur-[8px]"
                                          />

                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                                 className="relative w-full max-w-xl bg-white rounded-t-[3rem] lg:rounded-[3rem] shadow-[0_-25px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
                                          >
                                                 {/* Modal Header */}
                                                 <div className="flex flex-col items-center pt-3 pb-8 sticky top-0 bg-white/95 backdrop-blur-md z-30">
                                                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-8" />
                                                        <div className="w-full px-10 flex items-center justify-between">
                                                               <div className="flex flex-col">
                                                                      <h3 className="text-3xl font-black text-foreground tracking-tighter">
                                                                             {modal === "payment" ? "Recibir Pago" : "Asentar Cargo"}
                                                                      </h3>
                                                                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">{client.name}</span>
                                                               </div>
                                                               <button
                                                                      onClick={() => setModal(null)}
                                                                      className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-transform shadow-sm"
                                                               >
                                                                      <X className="w-6 h-6" />
                                                               </button>
                                                        </div>
                                                 </div>

                                                 <form onSubmit={(e) => { e.preventDefault(); handleAction(); }} className="flex-1 overflow-y-auto px-10 pb-32 scrollbar-hide">
                                                        <div className="space-y-10">
                                                               {/* Amount Input */}
                                                               <div className={cn(
                                                                      "p-12 lg:p-16 rounded-[3rem] border-2 text-center relative overflow-hidden transition-all group",
                                                                      modal === "payment" ? "bg-emerald-50/30 border-emerald-50" : "bg-rose-50/30 border-rose-50"
                                                               )}>
                                                                      <div className={cn("absolute top-0 left-0 w-full h-1.5", modal === "payment" ? "bg-emerald-500" : "bg-rose-500")} />
                                                                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 group-focus-within:text-foreground transition-colors">Importe ($)</p>
                                                                      <div className="flex items-center justify-center text-7xl font-black tracking-tighter text-foreground tabular-nums">
                                                                             <input
                                                                                    type="number"
                                                                                    autoFocus
                                                                                    required
                                                                                    value={amount || ''}
                                                                                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                                                                    className="bg-transparent border-none focus:outline-none w-full text-center placeholder:text-slate-200"
                                                                                    placeholder="0.00"
                                                                             />
                                                                      </div>
                                                               </div>

                                                               {/* Reason Input */}
                                                               <div className="space-y-4">
                                                                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
                                                                             <Info className="w-4 h-4" /> Motivo del Ajuste
                                                                      </label>
                                                                      <div className="relative group">
                                                                             <input
                                                                                    type="text"
                                                                                    value={description}
                                                                                    onChange={(e) => setDescription(e.target.value)}
                                                                                    placeholder={modal === "payment" ? "Ej: Pago parcial sifones" : "Ej: Ajuste por rotura"}
                                                                                    className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-[2rem] px-8 text-base font-bold text-foreground placeholder:text-slate-200 focus:outline-none focus:border-primary/20 focus:bg-white transition-all shadow-inner"
                                                                             />
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </form>

                                                 {/* Action Bar Sticky */}
                                                 <div className="absolute bottom-0 left-0 right-0 p-10 pt-4 pb-14 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40 flex gap-4">
                                                        <Button
                                                               type="button"
                                                               variant="ghost"
                                                               className="h-16 flex-1 rounded-3xl text-sm font-black uppercase tracking-widest text-slate-400 border border-slate-100 active:bg-slate-50 active:scale-95 transition-all outline-none"
                                                               onClick={() => setModal(null)}
                                                        >
                                                               Cancelar
                                                        </Button>
                                                        <Button
                                                               type="submit"
                                                               onClick={handleAction}
                                                               disabled={loading || amount <= 0}
                                                               className={cn(
                                                                      "h-16 flex-[2] text-white shadow-2xl rounded-3xl font-black text-sm uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center gap-3",
                                                                      modal === "payment" ? "bg-emerald-500 shadow-emerald-500/20" : "bg-rose-500 shadow-rose-500/20"
                                                               )}
                                                        >
                                                               {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                                                      <>
                                                                             <Check className="w-6 h-6 stroke-[3px]" />
                                                                             {modal === "payment" ? "Confirmar Pago" : "Asentar Cargo"}
                                                                      </>
                                                               )}
                                                        </Button>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}

                            {/* Summary Modal */}
                            {modal === "summary" && (
                                   <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 lg:p-10">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setModal(null)}
                                                 className="absolute inset-0 bg-black/40 backdrop-blur-[8px]"
                                          />

                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                                 className="relative w-full max-w-2xl h-[95vh] lg:h-auto bg-white rounded-t-[3.5rem] lg:rounded-[3.5rem] shadow-[0_-25px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
                                          >
                                                 <div className="flex flex-col items-center pt-3 pb-8 sticky top-0 bg-white/95 backdrop-blur-md z-30">
                                                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-8" />
                                                        <div className="w-full px-10 flex items-center justify-between">
                                                               <div className="flex flex-col">
                                                                      <h3 className="text-3xl font-black text-foreground tracking-tighter">Estado de Cta.</h3>
                                                                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">{client.name}</span>
                                                               </div>
                                                               <button
                                                                      onClick={() => setModal(null)}
                                                                      className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-transform shadow-sm"
                                                               >
                                                                      <X className="w-6 h-6" />
                                                               </button>
                                                        </div>
                                                 </div>

                                                 <div className="flex-1 overflow-y-auto px-10 pb-40 scrollbar-hide space-y-10">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                               <div className="p-10 bg-white border-2 border-slate-50 rounded-[2.5rem] shadow-2xl shadow-slate-200/30 relative overflow-hidden group">
                                                                      <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                                                                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4">Saldo Pendiente</p>
                                                                      <div className="text-5xl font-black tracking-tighter text-foreground tabular-nums">${client.balance.toLocaleString()}</div>
                                                               </div>
                                                               <div className="p-10 bg-white border-2 border-slate-50 rounded-[2.5rem] shadow-2xl shadow-slate-200/30 relative overflow-hidden">
                                                                      <div className="absolute top-0 left-0 w-2 h-full bg-indigo-400" />
                                                                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4">Stock Envases</p>
                                                                      <div className="text-5xl font-black tracking-tighter text-foreground tabular-nums">
                                                                             {client.bottlesBalance}
                                                                             <span className="text-lg font-black opacity-20 ml-2 tracking-widest uppercase">Unid.</span>
                                                                      </div>
                                                               </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                               <div className="flex items-center gap-3 px-2">
                                                                      <History className="w-4 h-4 text-primary opacity-40" />
                                                                      <h4 className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-400">Última Actividad</h4>
                                                               </div>
                                                               <div className="space-y-3">
                                                                      {client.transactions?.slice(0, 8).map((tx: any) => (
                                                                             <div key={tx.id} className="flex justify-between items-center p-6 bg-slate-50/50 rounded-[1.8rem] border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 group">
                                                                                    <div className="min-w-0 space-y-1">
                                                                                           <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest opacity-60 leading-none">{new Date(tx.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}</div>
                                                                                           <div className="font-black text-lg text-foreground tracking-tight group-hover:text-primary transition-colors leading-tight truncate pr-4">{tx.concept}</div>
                                                                                    </div>
                                                                                    <div className={cn(
                                                                                           "text-2xl font-black tracking-tighter tabular-nums px-3 py-1 rounded-xl shrink-0 leading-none",
                                                                                           tx.type === "DEBIT" ? "text-rose-500 bg-rose-50" : "text-emerald-500 bg-emerald-50"
                                                                                    )}>
                                                                                           {tx.type === "DEBIT" ? "+" : "-"}${tx.amount.toLocaleString()}
                                                                                    </div>
                                                                             </div>
                                                                      ))}
                                                               </div>
                                                        </div>
                                                 </div>

                                                 {/* Share Action Bar Sticky */}
                                                 <div className="absolute bottom-0 left-0 right-0 p-10 pt-4 pb-14 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-40">
                                                        <Button
                                                               onClick={handleWhatsAppSummary}
                                                               className="w-full h-18 rounded-[2.2rem] bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase tracking-[0.15em] text-sm shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 border-none group flex items-center justify-center gap-4"
                                                        >
                                                               <MessageCircle className="w-7 h-7 stroke-[2.5px] group-hover:rotate-12 transition-transform" />
                                                               Compartir Resumen por WhatsApp
                                                        </Button>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </>
       );
}
