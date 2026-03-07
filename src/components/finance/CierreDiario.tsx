"use client";

import { useState, useTransition } from "react";
import { X, TrendingUp, TrendingDown, Wallet, CreditCard, CheckCircle2, Loader2, Download } from "lucide-react";
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
                            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-black uppercase tracking-widest active:scale-95"
                     >
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Cierre de Caja</span>
                            <span className="sm:hidden">Cierre</span>
                     </button>

                     <AnimatePresence>
                            {open && (
                                   <>
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl"
                                                 onClick={() => !isPending && setOpen(false)}
                                          />
                                          <motion.div
                                                 initial={{ opacity: 0, y: "100%" }}
                                                 animate={{ opacity: 1, y: 0 }}
                                                 exit={{ opacity: 0, y: "100%" }}
                                                 transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                                 className="fixed inset-x-0 bottom-0 z-[210] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:w-full bg-black/98 border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
                                          >
                                                 {/* Header */}
                                                 <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                                                        <div className="flex items-center gap-3">
                                                               <div className="w-10 h-10 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                                                      <CheckCircle2 className="w-5 h-5" />
                                                               </div>
                                                               <div>
                                                                      <h2 className="text-base font-black uppercase tracking-tight text-white">Cierre de Caja</h2>
                                                                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mt-0.5 capitalize">{today}</p>
                                                               </div>
                                                        </div>
                                                        <button
                                                               onClick={() => setOpen(false)}
                                                               className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white"
                                                        >
                                                               <X className="w-4 h-4" />
                                                        </button>
                                                 </div>

                                                 <div className="flex-1 overflow-y-auto p-6 space-y-4">

                                                        {/* Big balance */}
                                                        <div className={cn(
                                                               "p-6 rounded-[1.5rem] border text-center",
                                                               balance >= 0 ? "bg-emerald-500/5 border-emerald-500/15" : "bg-rose-500/5 border-rose-500/15"
                                                        )}>
                                                               <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Balance del Día</p>
                                                               <div className={cn(
                                                                      "text-5xl font-black tracking-tighter tabular-nums",
                                                                      balance >= 0 ? "text-emerald-400" : "text-rose-400"
                                                               )}>
                                                                      {balance >= 0 ? "+" : ""}${balance.toLocaleString()}
                                                               </div>
                                                               <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 mt-3">{movementsCount} operaciones registradas</p>
                                                        </div>

                                                        {/* Detail grid */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                               <DetailCard
                                                                      icon={<TrendingUp className="w-4 h-4" />}
                                                                      label="Ingresos"
                                                                      value={totals.income}
                                                                      color="emerald"
                                                               />
                                                               <DetailCard
                                                                      icon={<TrendingDown className="w-4 h-4" />}
                                                                      label="Egresos"
                                                                      value={totals.expense}
                                                                      color="rose"
                                                               />
                                                               <DetailCard
                                                                      icon={<Wallet className="w-4 h-4" />}
                                                                      label="En Efectivo"
                                                                      value={totals.cash}
                                                                      color="white"
                                                               />
                                                               <DetailCard
                                                                      icon={<CreditCard className="w-4 h-4" />}
                                                                      label="Transferencia"
                                                                      value={totals.digital}
                                                                      color="blue"
                                                               />
                                                        </div>

                                                        {/* Confirmed state */}
                                                        <AnimatePresence>
                                                               {confirmed && (
                                                                      <motion.div
                                                                             initial={{ opacity: 0, scale: 0.95 }}
                                                                             animate={{ opacity: 1, scale: 1 }}
                                                                             className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                                                                      >
                                                                             <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                                                             <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                                                                                    Caja cerrada correctamente
                                                                             </p>
                                                                      </motion.div>
                                                               )}
                                                        </AnimatePresence>
                                                 </div>

                                                 {/* Actions */}
                                                 <div className="p-5 border-t border-white/5 flex gap-3 shrink-0">
                                                        <button
                                                               onClick={handlePrint}
                                                               className="h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                                                        >
                                                               <Download className="w-4 h-4" />
                                                               PDF
                                                        </button>
                                                        <button
                                                               onClick={handleConfirm}
                                                               disabled={isPending || confirmed}
                                                               className="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                                                        >
                                                               {isPending ? (
                                                                      <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                                                               ) : confirmed ? (
                                                                      <><CheckCircle2 className="w-4 h-4" /> Caja Cerrada</>
                                                               ) : (
                                                                      <><CheckCircle2 className="w-4 h-4" /> Confirmar Cierre</>
                                                               )}
                                                        </button>
                                                 </div>
                                          </motion.div>
                                   </>
                            )}
                     </AnimatePresence>
              </>
       );
}

function DetailCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
       const colors: any = {
              emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
              rose: "text-rose-400 bg-rose-500/5 border-rose-500/10",
              white: "text-white bg-white/5 border-white/10",
              blue: "text-blue-400 bg-blue-500/5 border-blue-500/10",
       };
       return (
              <div className={cn("p-4 rounded-xl border", colors[color])}>
                     <div className="flex items-center gap-2 mb-3">
                            {icon}
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60">{label}</p>
                     </div>
                     <div className="text-xl font-black tracking-tighter tabular-nums">${value.toLocaleString()}</div>
              </div>
       );
}
