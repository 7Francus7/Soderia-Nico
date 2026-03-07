"use strict";

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
                     <AnimatePresence>
                            {showMore && (
                                   <div className="fixed inset-0 z-[150] lg:hidden">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 className="absolute inset-0 bg-background/60 backdrop-blur-xs"
                                                 onClick={() => setShowMore(false)}
                                          />
                                          <motion.div
                                                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                 animate={{ opacity: 1, scale: 1, y: 0 }}
                                                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                                 className="absolute bottom-20 right-4 w-52 bg-white border border-border shadow-xl rounded-2xl p-1.5 flex flex-col gap-0.5"
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
                                                                             "flex items-center justify-between px-4 py-3 rounded-xl transition-all active:bg-secondary",
                                                                             isActive ? "bg-primary/5 text-primary font-bold" : "text-muted-foreground font-medium"
                                                                      )}
                                                               >
                                                                      <span className="text-xs tracking-tight">{item.name}</span>
                                                                      <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground/40")} />
                                                               </Link>
                                                        );
                                                 })}
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>

                     <nav className="fixed bottom-0 left-0 right-0 z-[160] lg:hidden bg-white/80 backdrop-blur-xl border-t border-border/50 pb-[env(safe-area-inset-bottom)]">
                            <div className="flex items-center justify-around h-16 max-w-md mx-auto">
                                   {primaryItems.map((item) => {
                                          const isMoreButton = item.isMenu;
                                          const isActive = isMoreButton ? (isMoreActive || showMore) : (pathname === item.href);

                                          return (
                                                 <button
                                                        key={item.name}
                                                        onClick={() => isMoreButton ? setShowMore(v => !v) : null}
                                                        className={cn(
                                                               "relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all group",
                                                               isActive ? "text-primary" : "text-muted-foreground"
                                                        )}
                                                 >
                                                        {!isMoreButton && <Link href={item.href} className="absolute inset-0 z-10" />}

                                                        <div className={cn(
                                                               "w-10 h-6 flex items-center justify-center rounded-full transition-all duration-300",
                                                               isActive ? "bg-primary/10" : "group-hover:bg-secondary"
                                                        )}>
                                                               <item.icon className={cn(
                                                                      "w-5 h-5 transition-all duration-300",
                                                                      isActive ? "stroke-[2.5px]" : "stroke-[2px]",
                                                                      isMenuOpen(isMoreButton, showMore) ? "rotate-45" : ""
                                                               )} />
                                                        </div>
                                                        <span className={cn(
                                                               "text-[9px] font-bold uppercase tracking-widest transition-all",
                                                               isActive ? "opacity-100" : "opacity-50"
                                                        )}>
                                                               {item.name}
                                                        </span>
                                                 </button>
                                          );
                                   })}
                            </div>
                     </nav>
              </>
       );
}

function isMenuOpen(isMenu: boolean | undefined, isOpen: boolean) {
       return isMenu && isOpen;
}
