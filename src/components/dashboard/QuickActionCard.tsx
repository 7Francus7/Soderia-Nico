"use strict";
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, ArrowRight } from "lucide-react";
import { QuickActionCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function QuickActionCard({ title, subtitle, icon, href, color }: QuickActionCardProps) {
       const colors = {
              blue: "border-blue-500/10 hover:bg-blue-500/[0.03]",
              sky: "border-sky-500/10 hover:bg-sky-500/[0.03]",
              rose: "border-rose-500/10 hover:bg-rose-500/[0.03]",
              emerald: "border-emerald-500/10 hover:bg-emerald-500/[0.03]",
       };

       const iconColors = {
              blue: "bg-blue-500/10 text-blue-400",
              sky: "bg-sky-500/10 text-sky-400",
              rose: "bg-rose-500/10 text-rose-400",
              emerald: "bg-emerald-500/10 text-emerald-400",
       };

       return (
              <motion.div
                     whileHover={{ y: -5 }}
                     whileTap={{ scale: 0.98 }}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="h-full"
              >
                     <Link href={href} className="group block h-full">
                            <div className={cn(
                                   "p-8 h-full rounded-[2.5rem] border bg-neutral-950/40 backdrop-blur-3xl transition-all duration-500 hover:shadow-2xl hover:border-white/20 flex flex-col justify-between group overflow-hidden relative",
                                   colors[color]
                            )}>
                                   {/* Decorative Background Element */}
                                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-white/[0.05] transition-all duration-700" />

                                   <div className="flex justify-between items-start relative z-10 mb-8">
                                          <div className={cn(
                                                 "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-xl group-hover:scale-110 group-hover:rotate-6",
                                                 iconColors[color]
                                          )}>
                                                 {icon}
                                          </div>
                                          <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center opacity-30 group-hover:opacity-100 group-hover:bg-white group-hover:text-black transition-all">
                                                 <ArrowRight className="w-5 h-5" />
                                          </div>
                                   </div>

                                   <div className="relative z-10">
                                          <h4 className="font-black text-2xl tracking-tighter text-white mb-2 uppercase italic group-hover:translate-x-2 transition-transform duration-500">
                                                 {title}
                                          </h4>
                                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors">
                                                 {subtitle}
                                          </p>
                                   </div>

                                   {/* Animated Border Reveal */}
                                   <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-[2.5rem] transition-all duration-700 pointer-events-none" />
                            </div>
                     </Link>
              </motion.div>
       );
}
