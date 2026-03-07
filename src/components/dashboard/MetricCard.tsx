"use strict";
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, ChevronRight } from "lucide-react";
import { MetricCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function MetricCard({ label, value, icon, color, href }: MetricCardProps) {
       const colors = {
              blue: "text-blue-500 bg-blue-50/50 border-blue-100/50 shadow-blue-500/5",
              purple: "text-indigo-500 bg-indigo-50/50 border-indigo-100/50 shadow-indigo-500/5",
              rose: "text-rose-500 bg-rose-50/50 border-rose-100/50 shadow-rose-500/5",
              amber: "text-amber-500 bg-amber-50/50 border-amber-100/50 shadow-amber-500/5",
       };

       const Content = (
              <div className="relative p-8 rounded-[2.8rem] bg-white border-2 border-slate-50 shadow-2xl shadow-slate-200/40 hover:shadow-slate-300/50 transition-all duration-500 group flex flex-col gap-6 overflow-hidden min-h-[180px]">
                     {/* Glass Overlay Effect */}
                     <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                     <div className="flex justify-between items-start">
                            <div className={cn("w-16 h-16 rounded-[1.6rem] flex items-center justify-center shrink-0 border transition-transform duration-500 group-hover:scale-110 shadow-sm", colors[color])}>
                                   <div className="scale-110 stroke-[2.5px]">{icon}</div>
                            </div>
                            {href && (
                                   <div className="w-10 h-10 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:bg-primary group-hover:text-white transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                                          <ChevronRight className="w-5 h-5 stroke-[3px]" />
                                   </div>
                            )}
                     </div>

                     <div className="relative z-10 px-1">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-2">{label}</p>
                            <h4 className="text-4xl font-black tracking-tighter text-foreground tabular-nums leading-none group-hover:translate-x-1 transition-transform duration-500">{value}</h4>
                            <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-700">
                                   <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                   <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Ver Detalles</span>
                            </div>
                     </div>
              </div>
       );

       return (
              <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     whileTap={{ scale: 0.96 }}
                     transition={{ duration: 0.6, type: "spring", damping: 20 }}
              >
                     {href ? <Link href={href} className="block">{Content}</Link> : Content}
              </motion.div>
       );
}
