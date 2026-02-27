"use client";

import { Droplets, Bell, Search } from "lucide-react";

export default function MobileHeader() {
       return (
              <header className="fixed top-0 left-0 right-0 h-16 bg-background/60 backdrop-blur-2xl border-b border-white/5 z-[90] flex items-center justify-between px-6 lg:hidden">
                     <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                                   <Droplets className="w-5 h-5" />
                            </div>
                            <h1 className="text-lg font-black tracking-tighter italic">
                                   Nico<span className="text-primary not-italic font-black">.</span>
                            </h1>
                     </div>

                     <div className="flex items-center gap-4">
                            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                                   <Search className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
                                   <Bell className="w-5 h-5" />
                                   <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-ping" />
                            </button>
                     </div>
              </header>
       );
}
