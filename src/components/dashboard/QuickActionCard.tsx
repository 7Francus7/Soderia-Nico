"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { QuickActionCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function QuickActionCard({ title, subtitle, icon, href, color }: QuickActionCardProps) {
       const colors = {
              blue: "hover:bg-blue-500/5 hover:border-blue-500/20",
              sky: "hover:bg-sky-500/5 hover:border-sky-500/20",
              rose: "hover:bg-rose-500/5 hover:border-rose-500/20",
              emerald: "hover:bg-emerald-500/5 hover:border-emerald-500/20",
       };

       return (
              <motion.div
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.3 }}
              >
                     <Link href={href} className="group block h-full">
                            <Card className={cn(
                                   "p-6 h-full rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-md flex items-center gap-4",
                                   colors[color]
                            )}>
                                   <div className="w-12 h-12 rounded-xl border border-border bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 flex-shrink-0">
                                          {icon}
                                   </div>
                                   <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-lg tracking-tight text-foreground">{title}</h4>
                                          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                                   </div>
                                   <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                            </Card>
                     </Link>
              </motion.div>
       );
}
