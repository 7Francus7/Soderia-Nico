"use strict";
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { MetricCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function MetricCard({ label, value, icon, color, href }: MetricCardProps) {
       const colors = {
              blue: "text-blue-600 bg-blue-50 border-blue-100/50",
              purple: "text-purple-600 bg-purple-50 border-purple-100/50",
              rose: "text-rose-600 bg-rose-50 border-rose-100/50",
              amber: "text-amber-600 bg-amber-50 border-amber-100/50",
       };

       const Content = (
              <div className="relative p-6 rounded-[2rem] bg-white border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group flex flex-col gap-4 overflow-hidden">
                     <div className="flex justify-between items-center px-1">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", colors[color])}>
                                   {icon}
                            </div>
                            {href && (
                                   <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-slate-400">
                                          <ArrowUpRight className="w-4 h-4" />
                                   </div>
                            )}
                     </div>

                     <div>
                            <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.1em] mb-1 px-1">{label}</p>
                            <h4 className="text-3xl font-bold tracking-tighter text-foreground tabular-nums px-1">{value}</h4>
                     </div>
              </div>
       );

       return (
              <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     whileHover={{ y: -4 }}
                     transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              >
                     {href ? <Link href={href} className="block">{Content}</Link> : Content}
              </motion.div>
       );
}
