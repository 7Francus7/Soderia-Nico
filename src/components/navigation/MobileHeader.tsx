"use client";

import { Droplets, Bell, Search, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function MobileHeader() {
       const { data: session } = useSession();

       return (
              <header className="fixed top-0 left-0 right-0 h-20 bg-background/40 backdrop-blur-3xl border-b border-white/5 z-[90] flex items-center justify-between px-6 lg:hidden">
                     <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-2xl shadow-primary/20 border border-primary/20 group overflow-hidden relative">
                                   <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                                   <Droplets className="w-6 h-6 relative z-10" />
                            </div>
                            <div className="flex flex-col -space-y-1">
                                   <h1 className="text-xl font-black tracking-tightest leading-none">
                                          NICO<span className="text-primary italic">.</span>
                                   </h1>
                                   <div className="flex items-center gap-2">
                                          <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                          <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30">OS v2.4.0</span>
                                   </div>
                            </div>
                     </div>

                     <div className="flex items-center gap-2">
                            <div className="flex items-center gap-4 mr-2">
                                   <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                                          <Search className="w-5 h-5" />
                                   </button>
                                   <button className="p-2 text-slate-500 hover:text-primary transition-colors relative">
                                          <Bell className="w-5 h-5" />
                                          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                                   </button>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-0.5">
                                   <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black italic text-primary">
                                          {session?.user?.name?.[0] || "A"}
                                   </div>
                            </div>
                     </div>
              </header>
       );
}
