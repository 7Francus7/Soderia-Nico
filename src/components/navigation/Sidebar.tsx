"use strict";
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
       LayoutDashboard, ShoppingCart, Truck, Users,
       CreditCard, Banknote, Package, LogOut, Droplet, ChevronRight, BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

const mainNavigation = [
       { name: "Inicio", href: "/", icon: LayoutDashboard },
       { name: "Pedidos", href: "/pedidos", icon: ShoppingCart },
       { name: "Repartos", href: "/repartos", icon: Truck },
];

const adminNavigation = [
       { name: "Clientes", href: "/clientes", icon: Users },
       { name: "Cuentas", href: "/cuentas", icon: CreditCard },
       { name: "Caja", href: "/caja", icon: Banknote },
       { name: "Productos", href: "/productos", icon: Package },
];

export default function Sidebar() {
       const pathname = usePathname();

       const NavLink = ({ item }: { item: any }) => {
              const isActive = pathname === item.href;
              return (
                     <Link
                            href={item.href}
                            className={cn(
                                   "group flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-200",
                                   isActive
                                          ? "bg-accent text-accent-foreground"
                                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                     >
                            <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                            <span className={cn("text-sm tracking-tight", isActive ? "font-semibold" : "font-medium")}>
                                   {item.name}
                            </span>
                            {isActive && (
                                   <div className="ml-auto">
                                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                   </div>
                            )}
                     </Link>
              );
       };

       return (
              <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-border z-40">
                     {/* Header */}
                     <div className="h-20 flex items-center px-6 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
                                          <Droplet className="text-white w-5 h-5 fill-current" />
                                   </div>
                                   <div className="flex flex-col">
                                          <h2 className="text-lg font-bold tracking-tight text-foreground leading-none">Sodería Nico</h2>
                                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em] mt-1">Admin Panel</span>
                                   </div>
                            </div>
                     </div>

                     {/* Navigation */}
                     <nav className="flex-1 p-4 space-y-8 overflow-y-auto scrollbar-hide">
                            <div className="space-y-1">
                                   <p className="px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Principal</p>
                                   {mainNavigation.map((item) => <NavLink key={item.name} item={item} />)}
                            </div>

                            <div className="space-y-1">
                                   <p className="px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Gestión</p>
                                   {adminNavigation.map((item) => <NavLink key={item.name} item={item} />)}
                            </div>
                     </nav>

                     {/* Footer Profile */}
                     <div className="p-4 border-t border-border">
                            <div className="p-4 rounded-3xl bg-secondary/50 border border-border/50">
                                   <div className="flex items-center gap-3 mb-4">
                                          <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-primary font-bold shadow-sm">
                                                 AD
                                          </div>
                                          <div className="flex flex-col min-w-0">
                                                 <p className="text-xs font-bold text-foreground truncate">Administrador</p>
                                                 <p className="text-[10px] font-medium text-muted-foreground">Admin Pro</p>
                                          </div>
                                   </div>
                                   <button
                                          title="Cerrar Sesión"
                                          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-danger bg-white border border-border rounded-2xl hover:bg-danger/5 hover:border-danger/20 transition-all active:scale-95"
                                          onClick={() => {/* Logout logic */ }}
                                   >
                                          <LogOut className="w-4 h-4" />
                                          Salir
                                   </button>
                            </div>
                     </div>
              </aside>
       );
}
