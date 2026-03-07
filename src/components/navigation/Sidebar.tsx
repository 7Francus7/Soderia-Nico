"use strict";
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
       ShieldCheck,
       LogOut,
       Settings,
       Droplets,
       UserCircle,
       ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";

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

export default function Sidebar() {
       const pathname = usePathname();
       const { data: session } = useSession();

       return (
              <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-[100] hidden lg:flex flex-col overflow-hidden">
                     {/* Brand Header */}
                     <Link href="/" className="flex items-center gap-3 px-6 py-5 border-b border-border">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
                                   <Droplets className="w-4 h-4" />
                            </div>
                            <div>
                                   <h1 className="text-sm font-bold text-foreground leading-none">Sodería Nico</h1>
                                   <span className="text-[10px] text-muted-foreground font-semibold">Sistema de Gestión</span>
                            </div>
                     </Link>

                     {/* Status Badge */}
                     <div className="px-6 py-3 border-b border-border bg-secondary/30">
                            <div className="flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                   <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Activo v2.5.0</span>
                            </div>
                     </div>

                     {/* Navigation List */}
                     <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-2">Módulos</p>
                            {navItems.map((item, idx) => {
                                   const isActive = pathname === item.href;
                                   return (
                                          <motion.div
                                                 key={item.href}
                                                 initial={{ opacity: 0, x: -10 }}
                                                 animate={{ opacity: 1, x: 0 }}
                                                 transition={{ delay: idx * 0.04 }}
                                          >
                                                 <Link
                                                        href={item.href}
                                                        className={cn(
                                                               "group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium",
                                                               isActive
                                                                      ? "bg-primary/10 text-primary shadow-sm"
                                                                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                                        )}
                                                 >
                                                        <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                                        <span className="flex-1 font-bold">{item.name}</span>
                                                        {isActive && (
                                                               <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                        )}
                                                 </Link>
                                          </motion.div>
                                   );
                            })}
                     </nav>

                     {/* Profile & Logout */}
                     <div className="p-3 border-t border-border space-y-1">
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/50">
                                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                          <UserCircle className="w-5 h-5" />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                          <p className="text-sm font-bold text-foreground truncate">
                                                 {session?.user?.name?.split(' ')[0] || "Administrador"}
                                          </p>
                                          <div className="flex items-center gap-1">
                                                 <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                                 <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Admin</span>
                                          </div>
                                   </div>
                            </div>

                            <button
                                   onClick={() => signOut()}
                                   className="group flex items-center gap-3 px-3 py-2 w-full rounded-lg text-rose-500 hover:bg-rose-50 transition-all duration-200 text-sm font-medium"
                            >
                                   <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                   <span>Cerrar Sesión</span>
                            </button>
                     </div>
              </aside>
       );
}
