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
                     {/* More Menu Overlay */}
                     <AnimatePresence>
                            {showMore && (
                                   <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          className="fixed inset-0 z-[98] bg-black/60 backdrop-blur-sm lg:hidden"
                                          onClick={() => setShowMore(false)}
                                   >
                                          <motion.div
                                                 initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                                 exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                                 transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                                                 className="absolute bottom-[5.5rem] left-4 right-4 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-4 shadow-2xl"
                                                 onClick={(e) => e.stopPropagation()}
                                          >
                                                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 px-3 pb-3">
                                                        Más módulos
                                                 </p>
                                                 <div className="grid grid-cols-2 gap-2">
                                                        {moreItems.map((item) => {
                                                               const isActive = pathname === item.href;
                                                               return (
                                                                      <Link
                                                                             key={item.href}
                                                                             href={item.href}
                                                                             onClick={() => setShowMore(false)}
                                                                             className={cn(
                                                                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-black text-xs uppercase tracking-wider",
                                                                                    isActive
                                                                                           ? "bg-white text-black"
                                                                                           : "text-white/60 hover:bg-white/5 hover:text-white"
                                                                             )}
                                                                      >
                                                                             <item.icon className="w-4 h-4" />
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
                            <div className="bg-black/95 backdrop-blur-xl border-t border-white/5 flex items-stretch justify-around"
                                   style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                                   {primaryItems.map((item) => {
                                          if (item.isMenu) {
                                                 const active = isMoreActive || showMore;
                                                 return (
                                                        <button
                                                               key="more"
                                                               onClick={() => setShowMore(v => !v)}
                                                               className={cn(
                                                                      "flex flex-col items-center justify-center gap-1 flex-1 py-3 transition-all duration-200 relative",
                                                                      active ? "text-white" : "text-white/30"
                                                               )}
                                                        >
                                                               {(active || showMore) && (
                                                                      <motion.div
                                                                             layoutId="mobile-active"
                                                                             className="absolute top-0 w-6 h-0.5 bg-white rounded-b-full"
                                                                             transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                                                      />
                                                               )}
                                                               <item.icon className={cn("w-5 h-5 transition-all", showMore ? "rotate-90" : "")} />
                                                               <span className="text-[9px] font-black uppercase tracking-wide">{item.name}</span>
                                                        </button>
                                                 );
                                          }

                                          const isActive = pathname === item.href;
                                          return (
                                                 <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={cn(
                                                               "flex flex-col items-center justify-center gap-1 flex-1 py-3 transition-all duration-200 relative",
                                                               isActive ? "text-white" : "text-white/30"
                                                        )}
                                                 >
                                                        {isActive && (
                                                               <motion.div
                                                                      layoutId="mobile-active"
                                                                      className="absolute top-0 w-6 h-0.5 bg-white rounded-b-full"
                                                                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                                               />
                                                        )}
                                                        <item.icon className={cn(
                                                               "w-5 h-5 transition-all duration-200",
                                                               isActive ? "scale-110" : ""
                                                        )} />
                                                        <span className={cn(
                                                               "text-[9px] font-black uppercase tracking-wide transition-all",
                                                               isActive ? "opacity-100" : "opacity-70"
                                                        )}>{item.name}</span>
                                                 </Link>
                                          );
                                   })}
                            </div>
                     </div>
              </>
       );
}
