"use strict";
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { MetricCardProps } from "@/types/dashboard";
import { motion } from "framer-motion";

export function MetricCard({ label, value, icon, color, href }: MetricCardProps) {
       const colorClasses = {
              blue: "from-blue-500/10 to-transparent border-blue-500/20 text-blue-400 shadow-blue-500/5",
              purple: "from-purple-500/10 to-transparent border-purple-500/20 text-purple-400 shadow-purple-500/5",
              rose: "from-rose-500/10 to-transparent border-rose-500/20 text-rose-400 shadow-rose-500/5",
              amber: "from-amber-500/10 to-transparent border-amber-500/20 text-amber-400 shadow-amber-500/5",
       };

       const containerClasses = cn(
              "relative overflow-hidden p-8 rounded-[3rem] border bg-neutral-900/40 backdrop-blur-xl transition-all duration-500 group flex flex-col justify-between h-48",
              colorClasses[color]
       );

       const Content = (
              <div className={containerClasses}>
                     {/* Glossy Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                     <div className="flex justify-between items-start relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-500 shadow-2xl">
                                   {icon}
                            </div>
                            {href && (
                                   <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-4">
                                          <ArrowUpRight className="w-5 h-5 text-white" />
                                   </div>
                            )}
                     </div>

                     <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2 transition-colors group-hover:text-white/40">
                                   {label}
                            </p>
                            <h4 className="text-4xl font-black tracking-tighter text-white tabular-nums group-hover:scale-105 origin-left transition-transform duration-500">
                                   {value}
                            </h4>
                     </div>

                     {/* Premium Bottom Bar */}
                     <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 group-hover:bg-white/20 transition-all overflow-hidden">
                            <motion.div
                                   initial={{ x: "-100%" }}
                                   whileHover={{ x: "100%" }}
                                   transition={{ duration: 0.8, ease: "easeInOut" }}
                                   className="w-1/2 h-full bg-white opacity-40 shadow-[0_0_20px_white]"
                            />
                     </div>
              </div>
       );

       return (
              <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     whileHover={{ y: -8 }}
                     className="perspective-1000"
              >
                     {href ? <Link href={href} className="block">{Content}</Link> : Content}
              </motion.div>
       );
}
