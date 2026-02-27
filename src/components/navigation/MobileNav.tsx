"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
       LayoutDashboard,
       Users,
       Truck,
       ShoppingBag,
       Menu,
       Droplets,
       CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const mobileItems = [
       { name: "Inicio", href: "/", icon: LayoutDashboard },
       { name: "Repartos", href: "/repartos", icon: Truck },
       { name: "Pedidos", href: "/pedidos", icon: ShoppingBag },
       { name: "Clientes", href: "/clientes", icon: Users },
];

export default function MobileNav() {
       const pathname = usePathname();

       return (
              <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden px-4 pb-6">
                     <div className="relative mx-auto max-w-lg glass-dark h-20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-around px-4 border-white/10 overflow-hidden">
                            {/* Pro-Max Accent Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-primary/40 blur-md" />

                            {mobileItems.map((item) => {
                                   const isActive = pathname === item.href;
                                   return (
                                          <Link
                                                 key={item.href}
                                                 href={item.href}
                                                 className={cn(
                                                        "flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-2xl transition-all duration-500 relative group",
                                                        isActive ? "text-primary" : "text-slate-500"
                                                 )}
                                          >
                                                 {isActive && (
                                                        <motion.div
                                                               layoutId="mobile-active"
                                                               className="absolute inset-0 bg-primary/10 rounded-2xl z-0"
                                                               transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                        />
                                                 )}

                                                 <item.icon className={cn(
                                                        "w-6 h-6 transition-all duration-500 relative z-10",
                                                        isActive ? "scale-110 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "opacity-50 group-hover:opacity-100"
                                                 )} />
                                                 <span className={cn(
                                                        "text-[8px] font-black uppercase tracking-[0.2em] transition-all relative z-10",
                                                        isActive ? "opacity-100 scale-105" : "opacity-40"
                                                 )}>{item.name}</span>

                                                 {isActive && (
                                                        <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),1)]" />
                                                 )}
                                          </Link>
                                   );
                            })}

                            <Link href="/cuentas" className="flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-2xl text-slate-500 transition-all opacity-40 hover:opacity-100">
                                   <CreditCard className="w-6 h-6" />
                                   <span className="text-[8px] font-black uppercase tracking-[0.2em]">Pagos</span>
                            </Link>
                     </div>
              </div>
       );
}
