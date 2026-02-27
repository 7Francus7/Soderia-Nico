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
              <div className="space-y-4">
                     {initialMovements.map((mv, idx) => (
                            <div
                                   key={mv.id}
                                   className="bg-card border border-white/5 rounded-[2rem] p-6 sm:px-10 flex flex-col sm:flex-row justify-between items-center gap-6 hover:border-white/10 transition-colors animate-fade-in-up shadow-xl shadow-black/5"
                                   style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                   <div className="flex items-center gap-6 w-full sm:w-auto">
                                          <div className={cn(
                                                 "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                                 mv.type === "INCOME" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                          )}>
                                                 {mv.type === "INCOME" ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                                          </div>
                                          <div>
                                                 <div className="font-black text-xl leading-tight uppercase tracking-tight">{mv.concept}</div>
                                                 <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground mt-1">
                                                        <span className="flex items-center gap-1">
                                                               {mv.paymentMethod === "CASH" ? <Banknote className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                                                               {mv.paymentMethod === "CASH" ? "EFECTIVO" : "TRANSFERENCIA"}
                                                        </span>
                                                        <span className="opacity-20">|</span>
                                                        <span className="flex items-center gap-1">
                                                               <Clock className="w-3 h-3" />
                                                               {new Date(mv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                 </div>
                                          </div>
                                   </div>

                                   <div className={cn(
                                          "text-3xl font-black tracking-tighter",
                                          mv.type === "INCOME" ? "text-emerald-500" : "text-rose-500"
                                   )}>
                                          {mv.type === "INCOME" ? "+" : "-"}${mv.amount.toLocaleString()}
                                   </div>
                            </div>
                     ))}
              </div>
       );
}
