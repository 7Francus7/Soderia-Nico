"use strict";
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { MetricCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function MetricCard({ label, value, icon, variant = "blue", description, href }: MetricCardProps) {
       const variants = {
              blue: "text-primary bg-primary/5 border-primary/10",
              purple: "text-indigo-600 bg-indigo-50/50 border-indigo-100",
              rose: "text-rose-600 bg-rose-50/50 border-rose-100",
              amber: "text-amber-600 bg-amber-50/50 border-amber-100",
              emerald: "text-success bg-success/5 border-success/10",
       };

       const Content = (
              <div className="group relative p-6 rounded-xl bg-white border border-border transition-all duration-300 hover:shadow-md hover:border-primary/20 overflow-hidden">
                     {/* Subtle Internal Glow */}
                     <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full opacity-10 transition-opacity group-hover:opacity-20", variants[variant as keyof typeof variants])} />

                     <div className="flex justify-between items-start relative z-10">
                            <div className={cn(
                                   "w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm",
                                   variants[variant as keyof typeof variants]
                            )}>
                                   <div className="shrink-0 scale-90">{icon}</div>
                            </div>
                            {href && (
                                   <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                          <ChevronRight className="w-4 h-4" />
                                   </button>
                            )}
                     </div>

                     <div className="mt-6 relative z-10">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">{label}</p>
                            <h4 className="text-3xl font-extrabold tracking-tighter text-foreground tabular-nums leading-none mb-2">{value}</h4>
                            {description && (
                                   <p className="text-[11px] font-medium text-muted-foreground tracking-tight opacity-70">{description}</p>
                            )}
                     </div>
              </div>
       );

       return (
              <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     whileTap={{ scale: 0.98 }}
                     transition={{ duration: 0.4, ease: "easeOut" }}
              >
                     {href ? <Link href={href} className="block">{Content}</Link> : Content}
              </motion.div>
       );
}
