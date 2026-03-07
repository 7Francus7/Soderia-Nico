"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Banknote, CreditCard, Clock, Wallet } from "lucide-react";

export default function CashMovementList({ initialMovements }: { initialMovements: any[] }) {
       if (initialMovements.length === 0) {
              return (
                     <div className="py-20 text-center bg-white border border-dashed border-border rounded-xl">
                            <Wallet className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                            <p className="font-semibold text-muted-foreground/40 text-sm italic">No hay movimientos registrados hoy.</p>
                     </div>
              );
       }

       return (
              <div className="space-y-3">
                     {initialMovements.map((mv, idx) => (
                            <div
                                   key={mv.id}
                                   className="bg-white border border-border rounded-xl p-4 sm:p-5 flex items-center gap-4 hover:border-primary/20 transition-all card-shadow hover:card-shadow-sm animate-fade-in-up"
                                   style={{ animationDelay: `${idx * 0.04}s` }}
                            >
                                   <div className={cn(
                                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
                                          mv.type === "INCOME" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
                                   )}>
                                          {mv.type === "INCOME" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                   </div>

                                   <div className="flex-1 min-w-0">
                                          <div className="font-bold text-sm sm:text-base leading-tight text-foreground truncate">{mv.concept}</div>
                                          <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/50 mt-1 uppercase tracking-wider">
                                                 <span className="flex items-center gap-1.5">
                                                        {mv.paymentMethod === "CASH" ? <Banknote className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                                                        <span>{mv.paymentMethod === "CASH" ? "Efectivo" : "Transferencia"}</span>
                                                 </span>
                                                 <span className="opacity-20">·</span>
                                                 <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(mv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                 </span>
                                          </div>
                                   </div>

                                   <div className={cn(
                                          "text-lg sm:text-xl font-bold tracking-tight tabular-nums shrink-0",
                                          mv.type === "INCOME" ? "text-emerald-600" : "text-rose-600"
                                   )}>
                                          {mv.type === "INCOME" ? "+" : "-"}${mv.amount.toLocaleString()}
                                   </div>
                            </div>
                     ))}
              </div>
       );
}
