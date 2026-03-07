"use strict";
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { MetricCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function MetricCard({ label, value, icon, color, href }: MetricCardProps) {
       const colorClasses = {
              blue: "bg-blue-50 border-blue-100 text-blue-600",
              purple: "bg-purple-50 border-purple-100 text-purple-600",
              rose: "bg-rose-50 border-rose-100 text-rose-600",
              amber: "bg-amber-50 border-amber-100 text-amber-600",
       };

       const iconBg = {
              blue: "bg-blue-100 text-blue-600",
              purple: "bg-purple-100 text-purple-600",
              rose: "bg-rose-100 text-rose-600",
              amber: "bg-amber-100 text-amber-600",
       };

       const Content = (
              <div className={cn(
                     "relative overflow-hidden p-4 sm:p-5 rounded-xl border bg-white card-shadow hover:card-shadow-md transition-all duration-200 group flex flex-col gap-3",
              )}>
                     <div className="flex justify-between items-start">
                            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", iconBg[color])}>
                                   {icon}
                            </div>
                            {href && (
                                   <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-muted-foreground">
                                          <ArrowUpRight className="w-3.5 h-3.5" />
                                   </div>
                            )}
                     </div>

                     <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
                            <h4 className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">{value}</h4>
                     </div>

                     {/* Bottom accent */}
                     <div className={cn("absolute bottom-0 left-0 w-full h-0.5 opacity-60", colorClasses[color].split(' ').filter(c => c.startsWith('bg-')).join(' '))} />
              </div>
       );

       return (
              <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     whileHover={{ y: -2 }}
                     transition={{ duration: 0.2 }}
              >
                     {href ? <Link href={href} className="block">{Content}</Link> : Content}
              </motion.div>
       );
}
