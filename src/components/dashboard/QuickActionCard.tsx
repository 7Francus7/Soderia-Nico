"use strict";
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, ArrowRight } from "lucide-react";
import { QuickActionCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function QuickActionCard({ title, subtitle, icon, href, color }: QuickActionCardProps) {
       const colors = {
              blue: "bg-blue-50/50 text-blue-500 border-blue-100/50 shadow-blue-500/5",
              sky: "bg-sky-50/50 text-sky-500 border-sky-100/50 shadow-sky-500/5",
              rose: "bg-rose-50/50 text-rose-500 border-rose-100/50 shadow-rose-500/5",
              emerald: "bg-emerald-50/50 text-emerald-500 border-emerald-100/50 shadow-emerald-500/5",
       };

       return (
              <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     whileTap={{ scale: 0.96 }}
                     transition={{ duration: 0.5, type: "spring", damping: 20 }}
              >
                     <Link href={href} className="group block">
                            <div className="flex items-center gap-6 p-7 rounded-[2.5rem] bg-white border-2 border-slate-50 shadow-2xl shadow-slate-200/40 hover:shadow-slate-300/50 hover:border-primary/20 transition-all duration-500 overflow-hidden relative">
                                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                   <div className={cn(
                                          "w-16 h-16 rounded-[1.8rem] flex items-center justify-center shrink-0 border transition-transform duration-500 group-hover:scale-110 shadow-sm",
                                          colors[color]
                                   )}>
                                          <div className="scale-110 stroke-[2.5px]">{icon}</div>
                                   </div>
                                   <div className="flex-1 min-w-0">
                                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-1.5">{subtitle}</p>
                                          <h4 className="text-xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors leading-none">{title}</h4>
                                   </div>
                                   <div className="w-12 h-12 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-center text-slate-200 group-hover:bg-primary group-hover:text-white group-hover:translate-x-1 transition-all duration-500">
                                          <ArrowRight className="w-6 h-6 stroke-[3px]" />
                                   </div>
                            </div>
                     </Link>
              </motion.div>
       );
}
