"use strict";
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { QuickActionCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function QuickActionCard({ title, subtitle, icon, href, color }: QuickActionCardProps) {
       const iconColors = {
              blue: "bg-blue-100 text-blue-600",
              sky: "bg-sky-100 text-sky-600",
              rose: "bg-rose-100 text-rose-600",
              emerald: "bg-emerald-100 text-emerald-600",
       };

       const hoverBorder = {
              blue: "hover:border-blue-200",
              sky: "hover:border-sky-200",
              rose: "hover:border-rose-200",
              emerald: "hover:border-emerald-200",
       };

       return (
              <motion.div
                     whileHover={{ y: -2 }}
                     whileTap={{ scale: 0.98 }}
                     initial={{ opacity: 0, y: 8 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.2 }}
              >
                     <Link href={href} className="group block">
                            <div className={cn(
                                   "flex items-center gap-3 p-4 rounded-xl border bg-white card-shadow hover:card-shadow-md transition-all duration-200",
                                   hoverBorder[color]
                            )}>
                                   <div className={cn(
                                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105",
                                          iconColors[color]
                                   )}>
                                          {icon}
                                   </div>
                                   <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-sm text-foreground">{title}</h4>
                                          <p className="text-xs text-muted-foreground">{subtitle}</p>
                                   </div>
                                   <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                            </div>
                     </Link>
              </motion.div>
       );
}
