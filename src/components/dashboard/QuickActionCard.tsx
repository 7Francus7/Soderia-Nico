"use strict";
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { QuickActionCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function QuickActionCard({ title, subtitle, icon, href, color = "primary" }: QuickActionCardProps) {
       const badgeColors = {
              primary: "bg-primary/5 text-primary border-primary/10",
              secondary: "bg-secondary text-secondary-foreground border-border",
              rose: "bg-danger/5 text-danger border-danger/10",
              sky: "bg-info/5 text-info border-info/10",
              amber: "bg-warning/5 text-warning border-warning/10",
              slate: "bg-muted text-muted-foreground border-border",
       };

       return (
              <motion.div
                     initial={{ opacity: 0, x: -5 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     whileTap={{ scale: 0.985 }}
                     transition={{ duration: 0.3 }}
              >
                     <Link href={href} className="group block">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
                                   <div className={cn(
                                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300",
                                          badgeColors[color as keyof typeof badgeColors]
                                   )}>
                                          <div className="scale-90">{icon}</div>
                                   </div>
                                   <div className="flex-1 min-w-0">
                                          <h4 className="text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors leading-none mb-1">{title}</h4>
                                          {subtitle && (
                                                 <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{subtitle}</p>
                                          )}
                                   </div>
                                   <div className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:bg-primary group-hover:text-white transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                                          <ChevronRight className="w-4 h-4" />
                                   </div>
                            </div>
                     </Link>
              </motion.div>
       );
}
