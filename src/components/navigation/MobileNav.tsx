"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
       LayoutDashboard,
       Users,
       Truck,
       ShoppingBag,
       Menu,
       Droplets
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
       { name: "Inicio", href: "/", icon: LayoutDashboard },
       { name: "Repartos", href: "/repartos", icon: Truck },
       { name: "Pedidos", href: "/pedidos", icon: ShoppingBag },
       { name: "Clientes", href: "/clientes", icon: Users },
];

export default function MobileNav() {
       const pathname = usePathname();

       return (
              <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden px-4 pb-4">
                     {/* Glass Floating Bar */}
                     <div className="relative mx-auto max-w-lg bg-zinc-950/60 backdrop-blur-3xl border border-white/10 h-20 rounded-[2.5rem] shadow-2xl overflow-hidden flex items-center justify-around px-2">
                            {mobileItems.map((item) => {
                                   const isActive = pathname === item.href;
                                   return (
                                          <Link
                                                 key={item.href}
                                                 href={item.href}
                                                 className={cn(
                                                        "flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-500 relative",
                                                        isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                                                 )}
                                          >
                                                 <item.icon className={cn("w-6 h-6 transition-all duration-500", isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "opacity-40")} />
                                                 <span className={cn("text-[9px] font-black uppercase tracking-widest transition-all", isActive ? "opacity-100" : "opacity-40")}>{item.name}</span>

                                                 {isActive && (
                                                        <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),1)] animate-pulse" />
                                                 )}
                                          </Link>
                                   );
                            })}

                            <button className="flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-2xl text-muted-foreground transition-all">
                                   <Menu className="w-6 h-6 opacity-40 hover:opacity-100" />
                                   <span className="text-[9px] font-black uppercase tracking-widest opacity-40 text-nowrap">Más</span>
                            </button>
                     </div>
              </div>
       );
}
