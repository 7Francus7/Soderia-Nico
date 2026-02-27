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
       ChevronRight
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
              <aside className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-[100] hidden lg:flex flex-col p-6 overflow-hidden">
                     {/* Brand Header */}
                     <Link href="/" className="flex items-center gap-3 px-3 mb-12 mt-2">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-sm">
                                   <Droplets className="w-6 h-6" />
                            </div>
                            <div className="space-y-0.5">
                                   <h1 className="text-xl font-bold tracking-tight">
                                          Sodería <span className="text-muted-foreground font-medium">Nico</span>
                                   </h1>
                                   <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">v2.4.0 Estable</p>
                            </div>
                     </Link>

                     {/* Navigation List */}
                     <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pb-10">
                            {navItems.map((item) => {
                                   const isActive = pathname === item.href;
                                   return (
                                          <Link
                                                 key={item.href}
                                                 href={item.href}
                                                 className={cn(
                                                        "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium relative",
                                                        isActive
                                                               ? "bg-primary/5 text-primary"
                                                               : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                 )}
                                          >
                                                 {isActive && (
                                                        <div className="absolute left-0 w-1 h-5 bg-primary rounded-full" />
                                                 )}
                                                 <item.icon className={cn("w-4.5 h-4.5", isActive ? "text-primary" : "text-muted-foreground/50 group-hover:text-foreground")} />
                                                 <span>{item.name}</span>
                                          </Link>
                                   );
                            })}
                     </nav>

                     {/* Profile & Logout */}
                     <div className="mt-auto space-y-4 pt-6 border-t border-border">
                            <div className="flex items-center gap-3 px-3">
                                   <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                                          <UserCircle className="w-6 h-6" />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                          <p className="text-sm font-semibold text-foreground truncate">{session?.user?.name || "Administrador"}</p>
                                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Root Access</p>
                                   </div>
                            </div>

                            <button
                                   onClick={() => signOut()}
                                   className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-rose-500/5 hover:text-rose-600 transition-all text-sm font-medium"
                            >
                                   <LogOut className="w-4.5 h-4.5" />
                                   <span>Cerrar Sesión</span>
                            </button>
                     </div>
              </aside>
       );
}
