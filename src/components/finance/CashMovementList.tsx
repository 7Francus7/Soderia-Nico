"use strict";
"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Banknote, CreditCard, Clock, Wallet, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CashMovementList({ initialMovements }: { initialMovements: any[] }) {
       if (initialMovements.length === 0) {
              return (
                     <div className="py-32 text-center bg-white border-2 border-dashed border-slate-100/50 rounded-[3rem]">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 opacity-40">
                                   <Wallet className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Sin Movimientos</h3>
                            <p className="text-xs font-bold text-slate-200 mt-2 uppercase tracking-tight">No hay registros hoy</p>
                     </div>
              );
       }

       return (
              <div className="space-y-4">
                     <AnimatePresence mode="popLayout" initial={false}>
                            {initialMovements.map((mv, idx) => (
                                   <motion.div
                                          key={mv.id}
                                          layout
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.4), type: "spring", bounce: 0.2 }}
                                          className="group bg-white border border-slate-100 rounded-[2.2rem] p-6 lg:p-8 flex items-center gap-6 hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-300 relative overflow-hidden active:scale-[0.98]"
                                   >
                                          {/* Icon Badge */}
                                          <div className={cn(
                                                 "w-14 h-14 rounded-[1.2rem] flex items-center justify-center shrink-0 shadow-sm border transition-transform group-hover:scale-110",
                                                 mv.type === "INCOME"
                                                        ? "bg-emerald-50 border-emerald-100/50 text-emerald-500 shadow-emerald-500/5"
                                                        : "bg-rose-50 border-rose-100/50 text-rose-500 shadow-rose-500/5"
                                          )}>
                                                 {mv.type === "INCOME" ? <ArrowUpRight className="w-7 h-7 stroke-[2.5px]" /> : <ArrowDownLeft className="w-7 h-7 stroke-[2.5px]" />}
                                          </div>

                                          {/* Concept & Details */}
                                          <div className="flex-1 min-w-0 space-y-1.5">
                                                 <div className="font-black text-lg lg:text-xl leading-none text-foreground truncate tracking-tight group-hover:text-primary transition-colors">
                                                        {mv.concept}
                                                 </div>
                                                 <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] opacity-60">
                                                        <span className="flex items-center gap-2">
                                                               {mv.paymentMethod === "CASH" ? <Banknote className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                                                               <span>{mv.paymentMethod === "CASH" ? "Efectivo" : "Transferencia"}</span>
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                        <span className="flex items-center gap-2">
                                                               <Clock className="w-3.5 h-3.5" />
                                                               {new Date(mv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                 </div>
                                          </div>

                                          {/* Amount & Arrow */}
                                          <div className="flex items-center gap-6 shrink-0">
                                                 <div className={cn(
                                                        "text-2xl lg:text-3xl font-black tracking-tighter tabular-nums px-4 py-2 rounded-2xl",
                                                        mv.type === "INCOME" ? "text-emerald-500 bg-emerald-50/50" : "text-rose-500 bg-rose-50/50"
                                                 )}>
                                                        {mv.type === "INCOME" ? "+" : "-"}${mv.amount.toLocaleString()}
                                                 </div>
                                                 <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:text-primary group-hover:bg-primary/5 transition-all hidden sm:flex">
                                                        <ChevronRight className="w-6 h-6" />
                                                 </div>
                                          </div>
                                   </motion.div>
                            ))}
                     </AnimatePresence>
              </div>
       );
}
