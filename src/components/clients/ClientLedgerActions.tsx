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
                     <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            <Button
                                   variant="outline"
                                   onClick={() => setModal("summary")}
                                   className="flex-1 md:flex-none h-11 px-6 rounded-xl border-border text-muted-foreground hover:bg-muted font-bold text-xs uppercase tracking-wider"
                            >
                                   <FileText className="w-4 h-4 mr-2" />
                                   RESUMEN
                            </Button>
                            <Button
                                   variant="outline"
                                   onClick={() => setModal("charge")}
                                   className="flex-1 md:flex-none h-11 px-6 rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50 font-bold text-xs uppercase tracking-wider"
                            >
                                   <PlusCircle className="w-4 h-4 mr-2" />
                                   CARGO
                            </Button>
                            <Button
                                   onClick={() => setModal("payment")}
                                   size="lg"
                                   className="flex-1 md:flex-none h-11 px-8 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20"
                            >
                                   <Banknote className="w-4 h-4 mr-2" />
                                   COBRAR
                            </Button>
                     </div>

                     <AnimatePresence>
                            {(modal === "payment" || modal === "charge") && (
                                   <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setModal(null)}
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
                                                               <div className={cn(
                                                                      "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm border",
                                                                      modal === "payment" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
                                                               )}>
                                                                      {modal === "payment" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-lg font-bold text-foreground">
                                                                             {modal === "payment" ? "Registrar Pago" : "Registrar Cargo"}
                                                                      </h3>
                                                                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{client.name}</p>
                                                               </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => setModal(null)} className="rounded-full w-9 h-9 border border-border">
                                                               <X className="w-5 h-5" />
                                                        </Button>
                                                 </div>

                                                 <div className="p-6 space-y-6">
                                                        <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center relative overflow-hidden shadow-inner">
                                                               <div className={cn(
                                                                      "absolute top-0 left-0 w-full h-1",
                                                                      modal === "payment" ? "bg-emerald-500" : "bg-rose-500"
                                                               )} />
                                                               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-2">Ingresa el monto</p>
                                                               <div className="flex items-center justify-center text-5xl font-bold tracking-tight text-foreground">
                                                                      <span className="text-xl text-muted-foreground/30 mr-1">$</span>
                                                                      <input
                                                                             type="number"
                                                                             autoFocus
                                                                             required
                                                                             value={amount || ''}
                                                                             onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                                                             className="bg-transparent border-none focus:outline-none w-48 text-center tabular-nums placeholder:text-slate-200"
                                                                             placeholder="0"
                                                                      />
                                                               </div>
                                                        </div>

                                                        <div className="space-y-1.5 px-1">
                                                               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Motivo / Concepto</label>
                                                               <div className="relative group">
                                                                      <Info className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                                      <input
                                                                             type="text"
                                                                             value={description}
                                                                             onChange={(e) => setDescription(e.target.value)}
                                                                             placeholder={modal === "payment" ? "Ej: Saldo mes de enero" : "Ej: Concepto varios"}
                                                                             className="w-full h-12 bg-muted/50 border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm"
                                                                      />
                                                               </div>
                                                        </div>

                                                        <div className="flex gap-3 pt-2">
                                                               <Button variant="ghost" className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest border border-border" onClick={() => setModal(null)}>Cancelar</Button>
                                                               <Button
                                                                      disabled={loading || amount <= 0}
                                                                      onClick={handleAction}
                                                                      className={cn(
                                                                             "flex-[2] h-12 shadow-lg rounded-xl font-bold text-xs uppercase tracking-widest",
                                                                             modal === "payment" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                                                                      )}
                                                               >
                                                                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                                             <span className="flex items-center gap-2">
                                                                                    {modal === "payment" ? "REGISTRAR PAGO" : "CONFIRMAR CARGO"}
                                                                                    <Check className="w-4 h-4" />
                                                                             </span>
                                                                      )}
                                                               </Button>
                                                        </div>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}

                            {modal === "summary" && (
                                   <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setModal(null)}
                                                 className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                          />

                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 className="relative w-full max-w-xl h-[95vh] sm:h-[85vh] bg-background sm:rounded-2xl border-t sm:border border-border shadow-2xl overflow-hidden flex flex-col"
                                          >
                                                 <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white sticky top-0 z-20">
                                                        <div className="flex items-center gap-4">
                                                               <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg shadow-sm">
                                                                      <FileText className="w-5 h-5" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-lg font-bold text-foreground">Estado de Cuenta</h3>
                                                                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{client.name}</p>
                                                               </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => setModal(null)} className="rounded-full w-9 h-9 border border-border">
                                                               <X className="w-5 h-5" />
                                                        </Button>
                                                 </div>

                                                 <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                                                        <div className="grid grid-cols-2 gap-4">
                                                               <div className="p-5 bg-white border border-border rounded-xl shadow-sm relative overflow-hidden group">
                                                                      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                                                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Saldo a la Fecha</p>
                                                                      <div className="text-4xl font-bold tracking-tight text-foreground tabular-nums">${client.balance.toLocaleString()}</div>
                                                               </div>
                                                               <div className="p-5 bg-white border border-border rounded-xl shadow-sm relative overflow-hidden">
                                                                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                                                                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Envases</p>
                                                                      <div className="text-4xl font-bold tracking-tight text-foreground tabular-nums">{client.bottlesBalance} <span className="text-xs text-muted-foreground/40 font-medium">U.</span></div>
                                                               </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                               <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Últimos Movimientos</h4>
                                                               <div className="space-y-2">
                                                                      {client.transactions?.slice(0, 15).map((tx: any) => (
                                                                             <div key={tx.id} className="flex justify-between items-center p-4 bg-white rounded-xl border border-border shadow-sm group hover:border-primary/50 transition-all">
                                                                                    <div className="min-w-0">
                                                                                           <div className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-0.5">{new Date(tx.createdAt).toLocaleDateString()}</div>
                                                                                           <div className="font-bold text-base text-foreground truncate">{tx.concept}</div>
                                                                                    </div>
                                                                                    <div className={cn(
                                                                                           "font-bold text-xl tracking-tight text-right tabular-nums",
                                                                                           tx.type === "DEBIT" ? "text-rose-600" : "text-emerald-600"
                                                                                    )}>
                                                                                           {tx.type === "DEBIT" ? "+" : "-"}${tx.amount.toLocaleString()}
                                                                                    </div>
                                                                             </div>
                                                                      ))}
                                                               </div>
                                                        </div>
                                                 </div>

                                                 <div className="p-4 bg-slate-50 border-t border-border sticky bottom-0 z-20">
                                                        <Button
                                                               onClick={handleWhatsAppSummary}
                                                               className="w-full h-14 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold uppercase tracking-widest text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95 border-none group"
                                                        >
                                                               <Share2 className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                                                               COMPARTIR POR WHATSAPP
                                                               <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                                        </Button>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </>
       );
}
