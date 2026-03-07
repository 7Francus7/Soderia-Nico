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
       MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const primaryItems = [
       { name: "Inicio", href: "/", icon: LayoutDashboard },
       { name: "Pedidos", href: "/pedidos", icon: ShoppingBag },
       { name: "Repartos", href: "/repartos", icon: Truck },
       { name: "Cuentas", href: "/cuentas", icon: CreditCard },
       { name: "Más", href: "#more", icon: MoreHorizontal, isMenu: true },
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
                     {/* More Menu Panel */}
                     <AnimatePresence>
                            {showMore && (
                                   <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          className="fixed inset-0 z-[98] bg-black/20 backdrop-blur-sm lg:hidden"
                                          onClick={() => setShowMore(false)}
                                   >
                                          <motion.div
                                                 initial={{ opacity: 0, y: 12, scale: 0.97 }}
                                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                                 exit={{ opacity: 0, y: 12, scale: 0.97 }}
                                                 transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                                                 className="absolute bottom-[5rem] left-3 right-3 bg-white border border-border rounded-2xl p-3 shadow-xl"
                                                 onClick={(e) => e.stopPropagation()}
                                          >
                                                 <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-2">
                                                        Más módulos
                                                 </p>
                                                 <div className="grid grid-cols-2 gap-1">
                                                        {moreItems.map((item) => {
                                                               const isActive = pathname === item.href;
                                                               return (
                                                                      <Link
                                                                             key={item.href}
                                                                             href={item.href}
                                                                             onClick={() => setShowMore(false)}
                                                                             className={cn(
                                                                                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium",
                                                                                    isActive
                                                                                           ? "bg-primary/10 text-primary"
                                                                                           : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                                             )}
                                                                      >
                                                                             <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "")} />
                                                                             {item.name}
                                                                      </Link>
                                                               );
                                                        })}
                                                 </div>
                                          </motion.div>
                                   </motion.div>
                            )}
                     </AnimatePresence>

                     {/* Bottom Nav Bar */}
                     <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden safe-area-bottom">
                            <div
                                   className="bg-white border-t border-border flex items-stretch justify-around"
                                   style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                            >
                                   {primaryItems.map((item) => {
                                          if (item.isMenu) {
                                                 const active = isMoreActive || showMore;
                                                 return (
                                                        <button
                                                               key="more"
                                                               onClick={() => setShowMore(v => !v)}
                                                               className={cn(
                                                                      "flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 transition-all duration-150 relative",
                                                                      active ? "text-primary" : "text-muted-foreground"
                                                               )}
                                                        >
                                                               {active && (
                                                                      <motion.div
                                                                             layoutId="mobile-active-indicator"
                                                                             className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full"
                                                                             transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                                                                      />
                                                               )}
                                                               <item.icon className={cn("w-5 h-5 transition-transform duration-150", showMore ? "rotate-90" : "")} />
                                                               <span className="text-[10px] font-medium">{item.name}</span>
                                                        </button>
                                                 );
                                          }

                                          const isActive = pathname === item.href;
                                          return (
                                                 <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={cn(
                                                               "flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 transition-all duration-150 relative",
                                                               isActive ? "text-primary" : "text-muted-foreground"
                                                        )}
                                                 >
                                                        {isActive && (
                                                               <motion.div
                                                                      layoutId="mobile-active-indicator"
                                                                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full"
                                                                      transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                                                               />
                                                        )}
                                                        <item.icon className={cn("w-5 h-5 transition-all duration-150", isActive ? "scale-105" : "")} />
                                                        <span className={cn("text-[10px] font-medium transition-all", isActive ? "font-semibold" : "")}>{item.name}</span>
                                                 </Link>
                                          );
                                   })}
                            </div>
                     </div>
              </>
       );
}
