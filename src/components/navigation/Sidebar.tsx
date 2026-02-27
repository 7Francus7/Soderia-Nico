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
       Circle,
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
       { name: "Sistemas", href: "/usuarios", icon: ShieldCheck },
];

export default function Sidebar() {
       const pathname = usePathname();
       const { data: session } = useSession();

       return (
              <aside className="fixed left-0 top-0 bottom-0 w-80 bg-slate-950/40 backdrop-blur-3xl border-r border-white/5 z-[100] hidden lg:flex flex-col p-8 overflow-hidden transition-all duration-700 font-sans">
                     {/* UI-UX-PRO-MAX: Organic Glow Backdrop */}
                     <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05)_0%,transparent_70%)] pointer-events-none" />

                     {/* Brand Header */}
                     <div className="relative group mb-14">
                            <Link href="/" className="flex items-center gap-4 px-2">
                                   <motion.div
                                          whileHover={{ rotate: 180 }}
                                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                          className="w-14 h-14 bg-primary/20 rounded-3xl flex items-center justify-center text-primary shadow-2xl shadow-primary/20"
                                   >
                                          <Droplets className="w-8 h-8" />
                                   </motion.div>
                                   <div className="space-y-0.5">
                                          <h1 className="text-2xl font-black tracking-tightest leading-none">
                                                 SODERÍA <span className="text-primary italic">NICO</span>
                                          </h1>
                                          <div className="flex items-center gap-2">
                                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                 <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">OS v2.4.0</p>
                                          </div>
                                   </div>
                            </Link>
                     </div>

                     {/* Navigation List */}
                     <nav className="flex-1 space-y-2 relative z-10 overflow-y-auto no-scrollbar py-4">
                            {navItems.map((item) => {
                                   const isActive = pathname === item.href;
                                   return (
                                          <Link
                                                 key={item.href}
                                                 href={item.href}
                                                 className={cn(
                                                        "group flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 relative overflow-hidden",
                                                        isActive
                                                               ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/40 font-black italic"
                                                               : "text-slate-400 hover:bg-white/5 hover:text-white font-bold hover:translate-x-1"
                                                 )}
                                          >
                                                 {isActive && (
                                                        <motion.div
                                                               layoutId="nav-active"
                                                               className="absolute inset-0 bg-primary z-[-1]"
                                                               transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                        />
                                                 )}
                                                 <item.icon className={cn("w-5 h-5 transition-transform duration-500", isActive ? "scale-110" : "opacity-30 group-hover:opacity-100")} />
                                                 <span className="tracking-tight text-[15px]">{item.name}</span>
                                                 {isActive && (
                                                        <ChevronRight className="absolute right-5 w-4 h-4 opacity-50" />
                                                 )}
                                          </Link>
                                   );
                            })}
                     </nav>

                     {/* User Profile Section */}
                     <div className="mt-auto pt-8 border-t border-white/5 space-y-6 relative z-10">
                            <div className="flex items-center gap-4 px-4 py-3 rounded-[2rem] bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-default overflow-hidden shimmer">
                                   <div className="w-11 h-11 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform border border-white/5">
                                          <Circle className="w-5 h-5 fill-current" />
                                   </div>
                                   <div className="flex-1 overflow-hidden">
                                          <p className="text-sm font-black tracking-tight truncate">{session?.user?.name || "Administrador"}</p>
                                          <p className="text-[9px] font-black uppercase tracking-widest opacity-30">Root Access</p>
                                   </div>
                                   <Settings className="w-4 h-4 opacity-20 hover:opacity-100 transition-opacity cursor-pointer animate-spin-slow" />
                            </div>

                            <button
                                   onClick={() => signOut()}
                                   className="flex items-center gap-4 px-6 py-4 w-full rounded-3xl text-rose-500/50 font-black text-xs uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-500 transition-all group"
                            >
                                   <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                   <span>Apagar Sistema</span>
                            </button>
                     </div>
              </aside>
       );
}
