"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Banknote, CreditCard, Clock } from "lucide-react";

export default function CashMovementList({ initialMovements }: { initialMovements: any[] }) {
       if (initialMovements.length === 0) {
              return (
                     <div className="py-20 text-center bg-card/40 border border-white/10 rounded-[2.5rem] glass-card">
                            <p className="text-xl font-bold opacity-30 italic">No hay movimientos registrados hoy.</p>
                     </div>
              );
       }

       return (
              <div className="space-y-3">
                     {initialMovements.map((mv, idx) => (
                            <div
                                   key={mv.id}
                                   className="bg-card border border-white/5 rounded-[1.75rem] p-4 sm:p-6 flex items-center gap-4 hover:border-white/10 transition-colors animate-fade-in-up shadow-lg"
                                   style={{ animationDelay: `${idx * 0.04}s` }}
                            >
                                   <div className={cn(
                                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0",
                                          mv.type === "INCOME" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                   )}>
                                          {mv.type === "INCOME" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                   </div>

                                   <div className="flex-1 min-w-0">
                                          <div className="font-black text-sm sm:text-base leading-tight uppercase tracking-tight text-white truncate">{mv.concept}</div>
                                          <div className="flex items-center gap-2 text-[9px] sm:text-xs font-bold text-muted-foreground mt-0.5">
                                                 <span className="flex items-center gap-1">
                                                        {mv.paymentMethod === "CASH" ? <Banknote className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                                                        <span className="hidden sm:inline">{mv.paymentMethod === "CASH" ? "EFECTIVO" : "TRANSFERENCIA"}</span>
                                                        <span className="sm:hidden">{mv.paymentMethod === "CASH" ? "EFE" : "TRF"}</span>
                                                 </span>
                                                 <span className="opacity-20">·</span>
                                                 <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(mv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                 </span>
                                          </div>
                                   </div>

                                   <div className={cn(
                                          "text-lg sm:text-2xl font-black tracking-tighter tabular-nums shrink-0",
                                          mv.type === "INCOME" ? "text-emerald-500" : "text-rose-500"
                                   )}>
                                          {mv.type === "INCOME" ? "+" : "-"}${mv.amount.toLocaleString()}
                                   </div>
                            </div>
                     ))}
              </div>
       );
}
