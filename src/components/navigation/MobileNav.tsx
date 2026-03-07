"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
       LayoutDashboard,
       Users,
       Truck,
       ShoppingBag,
       CreditCard,
       Banknote,
       Box,
       Settings,
       LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const primaryItems = [
       { name: "Inicio", href: "/", icon: LayoutDashboard },
       { name: "Pedidos", href: "/pedidos", icon: ShoppingBag },
       { name: "Repartos", href: "/repartos", icon: Truck },
       { name: "Cuentas", href: "/cuentas", icon: CreditCard },
       { name: "Módulos", href: "#more", icon: LayoutGrid, isMenu: true },
];

const moreItems = [
       { name: "Clientes", href: "/clientes", icon: Users },
       { name: "Caja", href: "/caja", icon: Banknote },
       { name: "Productos", href: "/productos", icon: Box },
       { name: "Ajustes", href: "/usuarios", icon: Settings },
];

export default function MobileNav() {
       const pathname = usePathname();
       const [showMore, setShowMore] = useState(false);

       const isMoreActive = moreItems.some(i => pathname === i.href);

       return (
              <>
                     {/* Floating Menu */}
                     <AnimatePresence>
                            {showMore && (
                                   <div className="fixed inset-0 z-[150] lg:hidden">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                                                 onClick={() => setShowMore(false)}
                                          />
                                          <motion.div
                                                 initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                 animate={{ opacity: 1, scale: 1, y: 0 }}
                                                 exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                 transition={{ duration: 0.2 }}
                                                 className="absolute bottom-20 right-4 w-56 bg-card border border-border rounded-xl p-2 shadow-2xl flex flex-col gap-1 overflow-hidden"
                                                 onClick={(e) => e.stopPropagation()}
                                          >
                                                 {moreItems.map((item) => {
                                                        const isActive = pathname === item.href;
                                                        return (
                                                               <Link
                                                                      key={item.href}
                                                                      href={item.href}
                                                                      onClick={() => setShowMore(false)}
                                                                      className={cn(
                                                                             "flex items-center justify-between px-4 py-3 rounded-lg transition-all active:bg-secondary",
                                                                             isActive ? "bg-primary/10 text-primary font-bold" : "text-foreground font-medium"
                                                                      )}
                                                               >
                                                                      <span className="text-sm tracking-tight">{item.name}</span>
                                                                      <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                                               </Link>
                                                        );
                                                 })}
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>

                     {/* Tab Bar Container */}
                     <div className="fixed bottom-0 left-0 right-0 z-[160] lg:hidden">
                            <div className="mx-0 pb-[env(safe-area-inset-bottom)] bg-background/80 backdrop-blur-lg border-t border-border">
                                   <div className="flex items-center justify-around h-16 pt-1 max-w-md mx-auto">
                                          {primaryItems.map((item) => {
                                                 const isMoreButton = item.isMenu;
                                                 const isActive = isMoreButton ? (isMoreActive || showMore) : (pathname === item.href);

                                                 return (
                                                        <button
                                                               key={item.name}
                                                               onClick={() => isMoreButton ? setShowMore(v => !v) : null}
                                                               className={cn(
                                                                      "relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all active:scale-95",
                                                                      isActive ? "text-primary" : "text-muted-foreground"
                                                               )}
                                                        >
                                                               {!isMoreButton ? (
                                                                      <Link href={item.href} className="absolute inset-0 z-10" />
                                                               ) : null}

                                                               <div className="relative">
                                                                      <item.icon className={cn(
                                                                             "w-5 h-5 transition-all duration-300",
                                                                             isActive ? "stroke-[2.5px]" : "stroke-[2px]",
                                                                             isMoreButton && showMore ? "rotate-90" : ""
                                                                      )} />
                                                                      {isActive && (
                                                                             <motion.div
                                                                                    layoutId="tab-active-dot"
                                                                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                                                                             />
                                                                      )}
                                                               </div>
                                                               <span className={cn(
                                                                      "text-[9px] font-bold uppercase tracking-wider transition-all",
                                                                      isActive ? "opacity-100" : "opacity-60"
                                                               )}>
                                                                      {item.name}
                                                               </span>
                                                        </button>
                                                 );
                                          })}
                                   </div>
                            </div>
                     </div>
              </>
       );
}
