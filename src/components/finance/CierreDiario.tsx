"use client";

import { useState, useTransition } from "react";
import { X, TrendingUp, TrendingDown, Wallet, CreditCard, CheckCircle2, Loader2, Download, Printer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CierreDiarioProps {
       totals: {
              income: number;
              expense: number;
              cash: number;
              digital: number;
       };
       movementsCount: number;
}

export default function CierreDiario({ totals, movementsCount }: CierreDiarioProps) {
       const [open, setOpen] = useState(false);
       const [confirmed, setConfirmed] = useState(false);
       const [isPending, startTransition] = useTransition();

       const balance = totals.income - totals.expense;
       const today = new Date().toLocaleDateString('es-AR', {
              weekday: 'long', day: 'numeric', month: 'long'
       });

       const handleConfirm = () => {
              startTransition(async () => {
                     // Simula cierre — en producción: llamar a una server action
                     await new Promise(res => setTimeout(res, 1200));
                     setConfirmed(true);
              });
       };

       const handlePrint = () => {
              window.print();
       };

       return (
              <>
                     <button
                            onClick={() => setOpen(true)}
                            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 transition-all text-[11px] font-bold uppercase tracking-widest active:scale-95 shadow-sm"
                     >
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Cierre de Caja</span>
                            <span className="sm:hidden">Cierre</span>
                     </button>

                     <AnimatePresence>
                            {open && (
                                   <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                                 onClick={() => !isPending && setOpen(false)}
                                          />
                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 className="relative w-full max-w-md bg-background rounded-t-2xl sm:rounded-2xl border-t sm:border border-border shadow-2xl flex flex-col overflow-hidden"
                                          >
                                                 {/* Header */}
                                                 <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white sticky top-0 z-20">
                                                        <div className="flex items-center gap-3">
                                                               <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 flex items-center justify-center rounded-lg text-emerald-600 shadow-sm">
                                                                      <CheckCircle2 className="w-5 h-5" />
                                                               </div>
                                                               <div>
                                                                      <h2 className="text-base font-bold text-foreground leading-none">Cierre de Caja</h2>
                                                                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1 capitalize">{today}</p>
                                                               </div>
                                                        </div>
                                                        <button
                                                               onClick={() => setOpen(false)}
                                                               className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted"
                                                        >
                                                               <X className="w-4 h-4" />
                                                        </button>
                                                 </div>

                                                 <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                                        {/* Balance */}
                                                        <div className={cn(
                                                               "p-8 rounded-2xl border text-center relative overflow-hidden shadow-inner",
                                                               balance >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
                                                        )}>
                                                               <div className={cn("absolute top-0 left-0 w-full h-1", balance >= 0 ? "bg-emerald-500" : "bg-rose-500")} />
                                                               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-2">Balance General del Día</p>
                                                               <div className={cn(
                                                                      "text-5xl font-bold tracking-tight tabular-nums",
                                                                      balance >= 0 ? "text-emerald-600" : "text-rose-600"
                                                               )}>
                                                                      {balance >= 0 ? "+" : ""}${balance.toLocaleString()}
                                                               </div>
                                                               <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 mt-4">{movementsCount} operaciones registradas</p>
                                                        </div>

                                                        {/* Grid */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                               <DetailCard
                                                                      icon={<TrendingUp className="w-3.5 h-3.5" />}
                                                                      label="Ingresos"
                                                                      value={totals.income}
                                                                      color="emerald"
                                                               />
                                                               <DetailCard
                                                                      icon={<TrendingDown className="w-3.5 h-3.5" />}
                                                                      label="Egresos"
                                                                      value={totals.expense}
                                                                      color="rose"
                                                               />
                                                               <DetailCard
                                                                      icon={<Wallet className="w-3.5 h-3.5" />}
                                                                      label="Efectivo"
                                                                      value={totals.cash}
                                                                      color="primary"
                                                               />
                                                               <DetailCard
                                                                      icon={<CreditCard className="w-3.5 h-3.5" />}
                                                                      label="Digital"
                                                                      value={totals.digital}
                                                                      color="blue"
                                                               />
                                                        </div>

                                                        {/* Status */}
                                                        <AnimatePresence>
                                                               {confirmed && (
                                                                      <motion.div
                                                                             initial={{ opacity: 0, scale: 0.98 }}
                                                                             animate={{ opacity: 1, scale: 1 }}
                                                                             className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 shadow-sm"
                                                                      >
                                                                             <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                                             <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                                                                                    Caja cerrada exitosamente
                                                                             </p>
                                                                      </motion.div>
                                                               )}
                                                        </AnimatePresence>
                                                 </div>

                                                 {/* Actions */}
                                                 <div className="p-4 border-t border-border bg-slate-50 flex gap-3 sticky bottom-0 z-20">
                                                        <button
                                                               onClick={handlePrint}
                                                               className="h-12 w-12 rounded-xl bg-white border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center shadow-sm"
                                                               title="Imprimir o Exportar"
                                                        >
                                                               <Printer className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                               onClick={handleConfirm}
                                                               disabled={isPending || confirmed}
                                                               className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                                                        >
                                                               {isPending ? (
                                                                      <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                                                               ) : confirmed ? (
                                                                      <><CheckCircle2 className="w-4 h-4" /> Caja Cerrada</>
                                                               ) : (
                                                                      <><CheckCircle2 className="w-4 h-4" /> Confirmar Cierre Diario</>
                                                               )}
                                                        </button>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </>
       );
}

function DetailCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
       const colors: any = {
              emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
              rose: "bg-rose-50 border-rose-100 text-rose-600",
              primary: "bg-slate-50 border-slate-100 text-slate-700",
              blue: "bg-blue-50 border-blue-100 text-blue-600",
       };
       return (
              <div className={cn("p-4 rounded-xl border group hover:shadow-sm transition-all", colors[color])}>
                     <div className="flex items-center gap-2 mb-2 opacity-60">
                            {icon}
                            <p className="text-[9px] font-bold uppercase tracking-widest">{label}</p>
                     </div>
                     <div className="text-xl font-bold tracking-tight tabular-nums leading-none">${value.toLocaleString()}</div>
              </div>
       );
}
