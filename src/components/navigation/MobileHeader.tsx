"use client";

import { Droplets, UserCircle, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
       LayoutDashboard, Users, Truck, ShoppingBag,
       CreditCard, Banknote, Box, Settings, LogOut, ShieldCheck
} from "lucide-react";

const navItems = [
       { name: "Inicio", href: "/", icon: LayoutDashboard },
       { name: "Pedidos", href: "/pedidos", icon: ShoppingBag },
       { name: "Repartos", href: "/repartos", icon: Truck },
       { name: "Clientes", href: "/clientes", icon: Users },
       { name: "Cuentas", href: "/cuentas", icon: CreditCard },
       { name: "Caja", href: "/caja", icon: Banknote },
       { name: "Productos", href: "/productos", icon: Box },
       { name: "Ajustes", href: "/usuarios", icon: Settings },
];

export default function MobileHeader() {
       const { data: session } = useSession();
       const pathname = usePathname();
       const [drawerOpen, setDrawerOpen] = useState(false);

       return (
              <>
                     <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-border z-[90] flex items-center justify-between px-4 lg:hidden">
                            <Link href="/" className="flex items-center gap-2.5">
                                   <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                                          <Droplets className="w-4 h-4" />
                                   </div>
                                   <span className="text-sm font-semibold text-foreground">Sodería Nico</span>
                            </Link>

                            <div className="flex items-center gap-2">
                                   <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center">
                                          <UserCircle className="w-4 h-4 text-muted-foreground" />
                                   </div>
                                   <button
                                          onClick={() => setDrawerOpen(true)}
                                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                          aria-label="Abrir menú"
                                   >
                                          <Menu className="w-4 h-4" />
                                   </button>
                            </div>
                     </header>

                     {/* Drawer Navigation */}
                     <AnimatePresence>
                            {drawerOpen && (
                                   <>
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 className="fixed inset-0 z-[110] bg-black/30 backdrop-blur-sm lg:hidden"
                                                 onClick={() => setDrawerOpen(false)}
                                          />
                                          <motion.div
                                                 initial={{ x: "100%" }}
                                                 animate={{ x: 0 }}
                                                 exit={{ x: "100%" }}
                                                 transition={{ type: "spring", damping: 28, stiffness: 280 }}
                                                 className="fixed top-0 right-0 bottom-0 w-64 bg-white border-l border-border z-[120] flex flex-col lg:hidden"
                                          >
                                                 {/* Drawer Header */}
                                                 <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                                                        <div className="flex items-center gap-3">
                                                               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                                                                      <Droplets className="w-4 h-4" />
                                                               </div>
                                                               <div>
                                                                      <p className="text-sm font-semibold text-foreground">{session?.user?.name || "Administrador"}</p>
                                                                      <div className="flex items-center gap-1">
                                                                             <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                                                             <span className="text-[10px] text-muted-foreground">Admin</span>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                        <button
                                                               onClick={() => setDrawerOpen(false)}
                                                               className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                                        >
                                                               <X className="w-3.5 h-3.5" />
                                                        </button>
                                                 </div>

                                                 {/* Nav Links */}
                                                 <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">Módulos</p>
                                                        {navItems.map((item) => {
                                                               const isActive = pathname === item.href;
                                                               return (
                                                                      <Link
                                                                             key={item.href}
                                                                             href={item.href}
                                                                             onClick={() => setDrawerOpen(false)}
                                                                             className={cn(
                                                                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium",
                                                                                    isActive
                                                                                           ? "bg-primary/10 text-primary"
                                                                                           : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                                             )}
                                                                      >
                                                                             <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                                                                             {item.name}
                                                                             {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                                                                      </Link>
                                                               );
                                                        })}
                                                 </nav>

                                                 {/* Sign Out */}
                                                 <div className="p-3 border-t border-border">
                                                        <button
                                                               onClick={() => signOut()}
                                                               className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-destructive hover:bg-destructive/8 transition-all duration-150 text-sm font-medium"
                                                        >
                                                               <LogOut className="w-4 h-4" />
                                                               Cerrar Sesión
                                                        </button>
                                                 </div>
                                          </motion.div>
                                   </>
                            )}
                     </AnimatePresence>
              </>
       );
}
