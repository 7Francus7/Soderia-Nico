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
       Droplets
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navItems = [
       { name: "Dashboard", href: "/", icon: LayoutDashboard },
       { name: "Pedidos", href: "/pedidos", icon: ShoppingBag },
       { name: "Repartos", href: "/repartos", icon: Truck },
       { name: "Clientes", href: "/clientes", icon: Users },
       { name: "Cuentas", href: "/cuentas", icon: CreditCard },
       { name: "Caja", href: "/caja", icon: Banknote },
       { name: "Productos", href: "/productos", icon: Box },
       { name: "Usuarios", href: "/usuarios", icon: ShieldCheck },
];

export default function Sidebar() {
       const pathname = usePathname();

       return (
              <aside className="fixed left-0 top-0 bottom-0 w-72 bg-card/30 backdrop-blur-3xl border-r border-white/5 z-[100] hidden lg:flex flex-col p-6 overflow-hidden">
                     {/* Logo */}
                     <div className="flex items-center gap-3 px-2 mb-12">
                            <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                                   <Droplets className="w-6 h-6 animate-pulse-soft" />
                            </div>
                            <div>
                                   <h1 className="text-xl font-black tracking-tighter leading-none">
                                          Sodería <span className="text-primary italic">Nico</span>
                                   </h1>
                                   <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">OS v2.0 Premium</p>
                            </div>
                     </div>

                     {/* Nav Items */}
                     <nav className="flex-1 space-y-2">
                            {navItems.map((item) => {
                                   const isActive = pathname === item.href;
                                   return (
                                          <Link
                                                 key={item.href}
                                                 href={item.href}
                                                 className={cn(
                                                        "group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                                                        isActive
                                                               ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 font-black italic"
                                                               : "text-muted-foreground hover:bg-white/5 hover:text-foreground font-bold"
                                                 )}
                                          >
                                                 <item.icon className={cn("w-5 h-5 transition-transform duration-500 group-hover:scale-110", isActive ? "scale-110" : "opacity-40")} />
                                                 <span className="tracking-tight">{item.name}</span>
                                                 {isActive && (
                                                        <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                                 )}
                                          </Link>
                                   );
                            })}
                     </nav>

                     {/* Footer / User */}
                     <div className="mt-auto pt-6 space-y-2 border-t border-white/5">
                            <button
                                   onClick={() => signOut()}
                                   className="flex items-center gap-4 px-4 py-3.5 w-full rounded-2xl text-rose-500/60 font-bold hover:bg-rose-500/10 hover:text-rose-500 transition-all group"
                            >
                                   <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                   <span>Cerrar Sesión</span>
                            </button>
                     </div>
              </aside>
       );
}
