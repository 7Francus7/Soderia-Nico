"use strict";
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface BalanceCardProps {
       label: string;
       value: number;
       icon: React.ReactNode;
       color: "emerald" | "rose" | "amber" | "blue";
}

export function BalanceCard({ label, value, icon, color }: BalanceCardProps) {
       const colors = {
              emerald: "text-emerald-500 bg-emerald-50 border-emerald-100",
              rose: "text-rose-500 bg-rose-50 border-rose-100",
              amber: "text-amber-500 bg-amber-50 border-amber-100",
              blue: "text-primary bg-primary/5 border-primary/20",
       };

       return (
              <motion.div
                     whileHover={{ y: -2 }}
                     initial={{ opacity: 0, scale: 0.98 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     className="relative p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col gap-4 overflow-hidden"
              >
                     <div className="flex justify-between items-start">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-300 shadow-sm", colors[color])}>
                                   <div className="stroke-[2px]">{icon}</div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                   <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                     </div>

                     <div className="relative z-10 px-0.5">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                            <h3 className="text-2xl font-bold tracking-tight text-foreground tabular-nums leading-none">
                                   ${value.toLocaleString()}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-2 transition-opacity duration-300">
                                   <div className={cn("w-1 h-1 rounded-full", color === "rose" ? "bg-rose-400" : "bg-emerald-400")} />
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Actualizado</span>
                            </div>
                     </div>
              </motion.div>
       );
}
