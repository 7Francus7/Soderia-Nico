"use client";

import { Droplets, Bell, Search, UserCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function MobileHeader() {
       const { data: session } = useSession();

       return (
              <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-[90] flex items-center justify-between px-6 lg:hidden">
                     <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-sm">
                                   <Droplets className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                   <h1 className="text-lg font-bold tracking-tight leading-none text-foreground">
                                          Sodería Nico
                                   </h1>
                                   <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">v2.4.0 Estable</span>
                            </div>
                     </div>

                     <div className="flex items-center gap-2">
                            <div className="flex items-center gap-3 mr-1">
                                   <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                                          <Search className="w-5 h-5" />
                                   </button>
                                   <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
                                          <Bell className="w-5 h-5" />
                                          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                                   </button>
                            </div>

                            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-muted text-muted-foreground">
                                   <UserCircle className="w-6 h-6" />
                            </div>
                     </div>
              </header>
       );
}
