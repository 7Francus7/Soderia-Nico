"use strict";
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, ChevronRight } from "lucide-react";
import { MetricCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function MetricCard({ label, value, icon, color, href }: MetricCardProps) {
       const colors = {
              blue: "text-blue-500 bg-blue-50 border-blue-100 shadow-blue-500/5",
              purple: "text-indigo-500 bg-indigo-50 border-indigo-100 shadow-indigo-500/5",
              rose: "text-rose-500 bg-rose-50 border-rose-100 shadow-rose-500/5",
              amber: "text-amber-500 bg-amber-50 border-amber-100 shadow-amber-500/5",
       };

       const Content = (
              <div className="relative p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col gap-4 overflow-hidden">
                     <div className="flex justify-between items-start">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-300 shadow-sm", colors[color])}>
                                   <div className="stroke-[2px]">{icon}</div>
                            </div>
                            {href && (
                                   <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                   </div>
                            )}
                     </div>

                     <div className="relative z-10 px-0.5">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                            <h4 className="text-3xl font-bold tracking-tight text-foreground tabular-nums leading-none">{value}</h4>
                            <div className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                   <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                   <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Analizar</span>
                            </div>
                     </div>
              </div>
       );

       return (
              <motion.div
                     initial={{ opacity: 0, scale: 0.98 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     whileTap={{ scale: 0.98 }}
                     transition={{ duration: 0.4 }}
              >
                     {href ? <Link href={href} className="block">{Content}</Link> : Content}
              </motion.div>
       );
}
