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
                     <header className="fixed top-0 left-0 right-0 h-14 bg-black/95 backdrop-blur-xl border-b border-white/5 z-[90] flex items-center justify-between px-4 lg:hidden">
                            <Link href="/" className="flex items-center gap-2.5">
                                   <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-black shadow-sm shrink-0">
                                          <Droplets className="w-4 h-4" />
                                   </div>
                                   <div className="flex flex-col leading-none">
                                          <span className="text-sm font-black tracking-tight text-white uppercase italic">Sodería Nico</span>
                                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">v2.5.0</span>
                                   </div>
                            </Link>

                            <div className="flex items-center gap-2">
                                   <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                          <UserCircle className="w-5 h-5 text-white/30" />
                                   </div>
                                   <button
                                          onClick={() => setDrawerOpen(true)}
                                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/50 hover:text-white transition-colors"
                                          aria-label="Abrir menú"
                                   >
                                          <Menu className="w-5 h-5" />
                                   </button>
                            </div>
                     </header>

                     {/* Full Drawer Navigation - alternative to mobile nav for quick access */}
                     <AnimatePresence>
                            {drawerOpen && (
                                   <>
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm lg:hidden"
                                                 onClick={() => setDrawerOpen(false)}
                                          />
                                          <motion.div
                                                 initial={{ x: "100%" }}
                                                 animate={{ x: 0 }}
                                                 exit={{ x: "100%" }}
                                                 transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                                 className="fixed top-0 right-0 bottom-0 w-72 bg-black/98 backdrop-blur-3xl border-l border-white/5 z-[120] flex flex-col lg:hidden"
                                          >
                                                 {/* Drawer Header */}
                                                 <div className="flex items-center justify-between p-6 border-b border-white/5">
                                                        <div className="flex items-center gap-3">
                                                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shrink-0">
                                                                      <Droplets className="w-5 h-5" />
                                                               </div>
                                                               <div>
                                                                      <p className="text-sm font-black text-white uppercase tracking-tight italic">{session?.user?.name || "Administrador"}</p>
                                                                      <div className="flex items-center gap-1 mt-0.5">
                                                                             <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                                                                             <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Admin</span>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                        <button
                                                               onClick={() => setDrawerOpen(false)}
                                                               className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                                        >
                                                               <X className="w-4 h-4" />
                                                        </button>
                                                 </div>

                                                 {/* Nav Links */}
                                                 <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                                        {navItems.map((item) => {
                                                               const isActive = pathname === item.href;
                                                               return (
                                                                      <Link
                                                                             key={item.href}
                                                                             href={item.href}
                                                                             onClick={() => setDrawerOpen(false)}
                                                                             className={cn(
                                                                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-xs font-black uppercase tracking-widest",
                                                                                    isActive
                                                                                           ? "bg-white text-black"
                                                                                           : "text-white/40 hover:bg-white/5 hover:text-white"
                                                                             )}
                                                                      >
                                                                             <item.icon className={cn("w-4 h-4", isActive ? "text-black" : "text-white/30")} />
                                                                             {item.name}
                                                                      </Link>
                                                               );
                                                        })}
                                                 </nav>

                                                 {/* Sign Out */}
                                                 <div className="p-4 border-t border-white/5">
                                                        <button
                                                               onClick={() => signOut()}
                                                               className="flex items-center gap-3 px-4 py-3 w-full rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 text-xs font-black uppercase tracking-widest"
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
