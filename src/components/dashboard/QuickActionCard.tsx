"use strict";
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { QuickActionCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function QuickActionCard({ title, subtitle, icon, href, color }: QuickActionCardProps) {
       const colors = {
              blue: "bg-blue-50 text-blue-600 border-blue-100/50 shadow-blue-500/10",
              sky: "bg-sky-50 text-sky-600 border-sky-100/50 shadow-sky-500/10",
              rose: "bg-rose-50 text-rose-600 border-rose-100/50 shadow-rose-500/10",
              emerald: "bg-emerald-50 text-emerald-600 border-emerald-100/50 shadow-emerald-500/10",
       };

       return (
              <motion.div
                     whileHover={{ x: 4 }}
                     whileTap={{ scale: 0.97 }}
                     initial={{ opacity: 0, x: -10 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
              >
                     <Link href={href} className="group block">
                            <div className="flex items-center gap-4 p-5 rounded-[1.8rem] bg-white border border-border/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)] transition-all duration-300">
                                   <div className={cn(
                                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 shadow-lg",
                                          colors[color]
                                   )}>
                                          {icon}
                                   </div>
                                   <div className="flex-1 min-w-0">
                                          <h4 className="font-bold text-[14px] text-foreground tracking-tight group-hover:text-primary transition-colors">{title}</h4>
                                          <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest">{subtitle}</p>
                                   </div>
                                   <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary transition-all">
                                          <ChevronRight className="w-4 h-4" />
                                   </div>
                            </div>
                     </Link>
              </motion.div>
       );
}
