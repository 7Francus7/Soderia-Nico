"use strict";
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, ArrowRight } from "lucide-react";
import { QuickActionCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function QuickActionCard({ title, subtitle, icon, href, color }: QuickActionCardProps) {
       const colors = {
              blue: "bg-blue-50 text-blue-500 border-blue-100",
              sky: "bg-sky-50 text-sky-500 border-sky-100",
              rose: "bg-rose-50 text-rose-500 border-rose-100",
              emerald: "bg-emerald-50 text-emerald-500 border-emerald-100",
       };

       return (
              <motion.div
                     initial={{ opacity: 0, x: -10 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     whileTap={{ scale: 0.98 }}
                     transition={{ duration: 0.3 }}
              >
                     <Link href={href} className="group block">
                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 overflow-hidden relative">
                                   <div className={cn(
                                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-300 shadow-sm",
                                          colors[color as keyof typeof colors]
                                   )}>
                                          <div className="stroke-[2px]">{icon}</div>
                                   </div>
                                   <div className="flex-1 min-w-0 ml-1">
                                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{subtitle}</p>
                                          <h4 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors leading-none">{title}</h4>
                                   </div>
                                   <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                          <ChevronRight className="w-5 h-5" />
                                   </div>
                            </div>
                     </Link>
              </motion.div>
       );
}
