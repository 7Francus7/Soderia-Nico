"use strict";
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
       label: string;
       value: number;
       icon: React.ReactNode;
       color: "emerald" | "rose" | "amber" | "blue";
}

export function BalanceCard({ label, value, icon, color }: BalanceCardProps) {
       const colors = {
              emerald: "text-emerald-500 bg-emerald-50 border-emerald-100 shadow-emerald-500/5",
              rose: "text-rose-500 bg-rose-50 border-rose-100 shadow-rose-500/5",
              amber: "text-amber-500 bg-amber-50 border-amber-100 shadow-amber-500/5",
              blue: "text-primary bg-primary/5 border-primary/10 shadow-primary/5",
       };

       return (
              <motion.div
                     whileHover={{ y: -4 }}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className={cn(
                            "group p-8 border rounded-[2.5rem] flex flex-col justify-between transition-all duration-300 bg-white",
                            colors[color]
                     )}
              >
                     <div className="flex justify-between items-start mb-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 leading-tight group-hover:opacity-100 transition-opacity">
                                   {label}
                            </p>
                            <div
                                   className={cn(
                                          "w-12 h-12 rounded-[1.2rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                                          colors[color],
                                          "bg-white"
                                   )}
                            >
                                   <div className="scale-110 stroke-[2.5px]">{icon}</div>
                            </div>
                     </div>
                     <h3 className="text-3xl font-black tracking-tighter tabular-nums leading-none">
                            ${value.toLocaleString()}
                     </h3>
              </motion.div>
       );
}
