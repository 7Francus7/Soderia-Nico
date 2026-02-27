"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { MetricCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function MetricCard({ label, value, icon, color, href }: MetricCardProps) {
       const colors = {
              blue: "border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/5",
              purple: "border-purple-500/20 text-purple-600 dark:text-purple-400 bg-purple-500/5",
              rose: "border-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-500/5",
              amber: "border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/5",
       };

       const Content = (
              <Card className={cn(
                     "p-8 rounded-2xl border transition-all duration-300 group relative flex flex-col justify-between hover:shadow-lg hover:border-primary/20 bg-card",
                     colors[color]
              )}>
                     <div className="flex justify-between items-start mb-6">
                            <div className="p-2.5 rounded-xl bg-background border border-border shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                   {icon}
                            </div>
                            {href && (
                                   <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                          <ArrowRight className="w-4 h-4" />
                                   </div>
                            )}
                     </div>

                     <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                            <h4 className="text-3xl font-semibold tracking-tight text-foreground">{value}</h4>
                     </div>
              </Card>
       );

       return (
              <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.4 }}
              >
                     {href ? <Link href={href} className="block">{Content}</Link> : Content}
              </motion.div>
       );
}
