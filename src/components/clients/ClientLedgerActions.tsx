"use strict";
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Banknote, PlusCircle, X, Loader2, FileText, Share2, ArrowUpRight, ArrowDownLeft, Info, Check, ArrowRight } from "lucide-react";
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
                     toast.error("El monto debe ser mayor a 0");
                     return;
              }

              setLoading(true);
              try {
                     const action = modal === "payment" ? registerPayment : registerCharge;
                     const result = await action(client.id, amount, description);

                     if (result.success) {
                            toast.success(modal === "payment" ? "¡Pago registrado con éxito!" : "Cargo registrado");
                            setModal(null);
                            setAmount(0);
                            setDescription("");
                     } else {
                            toast.error("Error: " + result.error);
                     }
              } catch (e) {
                     toast.error("Error en la conexión");
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
              toast.success("Resumen compartido");
       };

       return (
              <>
                     <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <Button
                                   variant="outline"
                                   onClick={() => setModal("summary")}
                                   className="flex-1 md:flex-none h-16 px-10 rounded-[2rem] border-white/10 text-white/40 hover:text-white"
                            >
                                   <FileText className="w-5 h-5 mr-3" />
                                   RESUMEN
                            </Button>
                            <Button
                                   variant="outline"
                                   onClick={() => setModal("charge")}
                                   className="flex-1 md:flex-none h-16 px-10 rounded-[2rem] border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                            >
                                   <PlusCircle className="w-5 h-5 mr-3" />
                                   CARGO
                            </Button>
                            <Button
                                   onClick={() => setModal("payment")}
                                   variant="premium"
                                   size="lg"
                                   className="flex-1 md:flex-none px-12"
                            >
                                   <Banknote className="w-6 h-6 mr-3" />
                                   COBRAR
                            </Button>
                     </div>

                     <AnimatePresence>
                            {(modal === "payment" || modal === "charge") && (
                                   <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 overflow-hidden">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setModal(null)}
                                                 className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                                          />

                                          <motion.div
                                                 initial={{ y: 50, opacity: 0 }}
                                                 animate={{ y: 0, opacity: 1 }}
                                                 exit={{ y: 50, opacity: 0 }}
                                                 className="relative w-full max-w-lg bg-neutral-900 sm:rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col text-white"
                                          >
                                                 <div className="p-10 pb-6 flex justify-between items-center">
                                                        <div className="flex items-center gap-6">
                                                               <div className={cn(
                                                                      "w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all",
                                                                      modal === "payment" ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-rose-500 text-white shadow-rose-500/20"
                                                               )}>
                                                                      {modal === "payment" ? <ArrowDownLeft className="w-8 h-8" /> : <ArrowUpRight className="w-8 h-8" />}
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                                                                             {modal === "payment" ? "Registro Pago" : "Cargar Deuda"}
                                                                      </h3>
                                                                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mt-3">{client.name}</p>
                                                               </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => setModal(null)} className="rounded-full w-14 h-14 hover:bg-white/5 border border-white/5">
                                                               <X className="w-8 h-8" />
                                                        </Button>
                                                 </div>

                                                 <div className="p-10 space-y-10">
                                                        <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 text-center relative overflow-hidden">
                                                               <div className={cn(
                                                                      "absolute top-0 left-0 w-full h-1.5",
                                                                      modal === "payment" ? "bg-emerald-500" : "bg-rose-500"
                                                               )} />
                                                               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Monto de Operación</p>
                                                               <div className="flex items-center justify-center text-8xl font-black tracking-tighter text-white">
                                                                      <span className="text-3xl text-white/20 mt-4 mr-2">$</span>
                                                                      <input
                                                                             type="number"
                                                                             autoFocus
                                                                             required
                                                                             value={amount || ''}
                                                                             onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                                                             className="bg-transparent border-none focus:outline-none w-64 text-center tabular-nums"
                                                                             placeholder="0"
                                                                      />
                                                               </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                               <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-6">Motivo / Concepto</label>
                                                               <div className="relative group">
                                                                      <Info className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-white transition-colors" />
                                                                      <input
                                                                             type="text"
                                                                             value={description}
                                                                             onChange={(e) => setDescription(e.target.value)}
                                                                             placeholder={modal === "payment" ? "Ej: Saldo mes de enero" : "Ej: Concepto varios"}
                                                                             className="w-full h-20 bg-white/5 border border-white/10 rounded-[2.5rem] pl-16 pr-8 font-bold text-xl text-white focus:outline-none focus:ring-4 focus:ring-white/10 transition-all placeholder:text-white/10"
                                                                      />
                                                               </div>
                                                        </div>

                                                        <div className="flex gap-6">
                                                               <Button variant="ghost" className="flex-1 h-20 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white/5 text-white/30 hover:text-white" onClick={() => setModal(null)}>Cancelar</Button>
                                                               <Button
                                                                      disabled={loading || amount <= 0}
                                                                      onClick={handleAction}
                                                                      variant="action"
                                                                      size="xl"
                                                                      className={cn(
                                                                             "flex-[2.5] shadow-2xl active:scale-95",
                                                                             modal === "payment" ? "shadow-emerald-500/10" : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                                                                      )}
                                                               >
                                                                      {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                                                                             <span className="flex items-center gap-3">
                                                                                    {modal === "payment" ? "REGISTRAR PAGO" : "CONFIRMAR CARGO"}
                                                                                    <Check className="w-7 h-7" />
                                                                             </span>
                                                                      )}
                                                               </Button>
                                                        </div>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}

                            {modal === "summary" && (
                                   <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 overflow-hidden">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setModal(null)}
                                                 className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                                          />

                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 className="relative w-full max-w-xl h-screen sm:h-[85vh] bg-neutral-900 sm:rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col text-white"
                                          >
                                                 <div className="p-10 pb-6 flex justify-between items-center relative z-10">
                                                        <div className="flex items-center gap-6">
                                                               <div className="w-16 h-16 bg-white text-black rounded-[2rem] flex items-center justify-center shadow-2xl">
                                                                      <FileText className="w-8 h-8" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Resumen Global</h3>
                                                                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mt-3">{client.name}</p>
                                                               </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => setModal(null)} className="rounded-full w-14 h-14 hover:bg-white/5 border border-white/5">
                                                               <X className="w-8 h-8" />
                                                        </Button>
                                                 </div>

                                                 <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-10">
                                                        <div className="flex flex-col sm:flex-row justify-between gap-8 p-10 bg-white/5 rounded-[3.5rem] border border-white/10 relative overflow-hidden group">
                                                               <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                                                               <div className="relative z-10">
                                                                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Saldo a la Fecha</p>
                                                                      <div className="text-7xl font-black tracking-tighter text-white tabular-nums">${client.balance.toLocaleString()}</div>
                                                               </div>
                                                               <div className="relative z-10 sm:text-right flex flex-col justify-end">
                                                                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2">Envases</p>
                                                                      <div className="text-4xl font-black tracking-tighter text-white tabular-nums">{client.bottlesBalance} <span className="text-xs opacity-30">UNID.</span></div>
                                                               </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                               <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 px-6">Historial de Operaciones</h4>
                                                               <div className="grid grid-cols-1 gap-4">
                                                                      {client.transactions?.slice(0, 15).map((tx: any) => (
                                                                             <div key={tx.id} className="flex justify-between items-center p-7 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group">
                                                                                    <div className="min-w-0">
                                                                                           <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">{new Date(tx.createdAt).toLocaleDateString()}</div>
                                                                                           <div className="font-black text-2xl text-white group-hover:translate-x-2 transition-transform tracking-tight">{tx.concept}</div>
                                                                                    </div>
                                                                                    <div className={cn(
                                                                                           "font-black text-3xl tracking-tighter text-right tabular-nums",
                                                                                           tx.type === "DEBIT" ? "text-rose-500" : "text-emerald-500"
                                                                                    )}>
                                                                                           {tx.type === "DEBIT" ? "+" : "-"}${tx.amount.toLocaleString()}
                                                                                    </div>
                                                                             </div>
                                                                      ))}
                                                               </div>
                                                        </div>
                                                 </div>

                                                 <div className="p-10 bg-black/40 border-t border-white/10 relative z-20">
                                                        <Button
                                                               onClick={handleWhatsAppSummary}
                                                               className="w-full h-24 rounded-[3rem] bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase tracking-[0.2em] text-base shadow-2xl transition-all active:scale-95 border-none group"
                                                        >
                                                               <Share2 className="w-7 h-7 mr-4 group-hover:rotate-12 transition-transform" />
                                                               ENVIAR RESUMEN POR WHATSAPP
                                                               <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" />
                                                        </Button>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </>
       );
}
