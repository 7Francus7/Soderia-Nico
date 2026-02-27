"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
       LayoutDashboard,
       Users,
       Truck,
       ShoppingBag,
       Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
       { name: "Inicio", href: "/", icon: LayoutDashboard },
       { name: "Pedidos", href: "/pedidos", icon: ShoppingBag },
       { name: "Repartos", href: "/repartos", icon: Truck },
       { name: "Clientes", href: "/clientes", icon: Users },
];

export default function MobileNav() {
       const pathname = usePathname();

       return (
              <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">
                     {/* Glassy Background */}
                     <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl border-t border-white/10" />

                     <div className="relative flex justify-around items-center h-20 px-4">
                            {mobileItems.map((item) => {
                                   const isActive = pathname === item.href;
                                   return (
                                          <Link
                                                 key={item.href}
                                                 href={item.href}
                                                 className={cn(
                                                        "flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-2xl transition-all duration-300 relative",
                                                        isActive ? "text-primary scale-110 font-black italic" : "text-muted-foreground font-bold"
                                                 )}
                                          >
                                                 <item.icon className={cn("w-6 h-6", isActive ? "fill-primary/20" : "opacity-40")} />
                                                 <span className="text-[10px] uppercase tracking-widest">{item.name}</span>
                                                 {isActive && (
                                                        <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full" />
                                                 )}
                                          </Link>
                                   );
                            })}
                            {/* Extra "More" button for remaining sections */}
                            <button className="flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-2xl text-muted-foreground font-bold hover:text-foreground transition-all">
                                   <Menu className="w-6 h-6 opacity-40" />
                                   <span className="text-[10px] uppercase tracking-widest text-nowrap">Más</span>
                            </button>
                     </div>
              </div>
       );
}
