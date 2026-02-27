"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
       LayoutDashboard,
       Users,
       Truck,
       ShoppingBag,
       CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const mobileItems = [
       { name: "Inicio", href: "/", icon: LayoutDashboard },
       { name: "Pedidos", href: "/pedidos", icon: ShoppingBag },
       { name: "Repartos", href: "/repartos", icon: Truck },
       { name: "Clientes", href: "/clientes", icon: Users },
       { name: "Pagos", href: "/cuentas", icon: CreditCard },
];

export default function MobileNav() {
       const pathname = usePathname();

       return (
              <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">
                     <div className="bg-background/90 backdrop-blur-md border-t border-border h-20 flex items-center justify-around px-2">
                            {mobileItems.map((item) => {
                                   const isActive = pathname === item.href;
                                   return (
                                          <Link
                                                 key={item.href}
                                                 href={item.href}
                                                 className={cn(
                                                        "flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-all duration-200 relative",
                                                        isActive ? "text-primary" : "text-muted-foreground"
                                                 )}
                                          >
                                                 {isActive && (
                                                        <motion.div
                                                               layoutId="mobile-active"
                                                               className="absolute top-0 w-8 h-1 bg-primary rounded-b-full"
                                                               transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                                        />
                                                 )}

                                                 <item.icon className={cn(
                                                        "w-5.5 h-5.5 transition-all duration-200",
                                                        isActive ? "text-primary" : "opacity-70"
                                                 )} />
                                                 <span className={cn(
                                                        "text-[10px] font-semibold transition-all",
                                                        isActive ? "opacity-100" : "opacity-70"
                                                 )}>{item.name}</span>
                                          </Link>
                                   );
                            })}
                     </div>
              </div>
       );
}
