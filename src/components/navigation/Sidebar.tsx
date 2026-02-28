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
       Activity,
       Zap
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
              <aside className="fixed left-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-3xl border-r border-white/5 z-[100] hidden lg:flex flex-col p-10 overflow-hidden">
                     {/* Glossy Overlay */}
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                     {/* Brand Header */}
                     <Link href="/" className="flex flex-col gap-6 mb-16 relative z-10 px-2">
                            <div className="flex items-center gap-4">
                                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                          <Droplets className="w-8 h-8" />
                                   </div>
                                   <div className="space-y-0 text-white">
                                          <h1 className="text-3xl font-black tracking-tighter italic uppercase leading-none">
                                                 Nico<br /><span className="text-white/20 font-light not-italic">Sodería</span>
                                          </h1>
                                   </div>
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                                   <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                   <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500">System v2.5.0 Stable</span>
                            </div>
                     </Link>

                     {/* Navigation List */}
                     <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar relative z-10 pr-2">
                            {navItems.map((item, idx) => {
                                   const isActive = pathname === item.href;
                                   return (
                                          <motion.div
                                                 key={item.href}
                                                 initial={{ opacity: 0, x: -20 }}
                                                 animate={{ opacity: 1, x: 0 }}
                                                 transition={{ delay: idx * 0.05 }}
                                          >
                                                 <Link
                                                        href={item.href}
                                                        className={cn(
                                                               "group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em] relative overflow-hidden",
                                                               isActive
                                                                      ? "bg-white text-black shadow-2xl shadow-white/10"
                                                                      : "text-white/40 hover:bg-white/5 hover:text-white"
                                                        )}
                                                 >
                                                        <div className="flex items-center gap-4 relative z-10">
                                                               <item.icon className={cn("w-5 h-5 transition-transform duration-500 group-hover:scale-110", isActive ? "text-black" : "text-white/20 group-hover:text-white")} />
                                                               <span>{item.name}</span>
                                                        </div>
                                                        {isActive && (
                                                               <ChevronRight className="w-4 h-4 relative z-10" />
                                                        )}
                                                 </Link>
                                          </motion.div>
                                   );
                            })}
                     </nav>

                     {/* Profile & Logout */}
                     <div className="mt-auto space-y-8 pt-10 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-5 px-2">
                                   <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 shadow-2xl overflow-hidden relative group">
                                          <UserCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                          <p className="text-sm font-black text-white italic truncate uppercase tracking-tighter">
                                                 {session?.user?.name || "Administrador"}
                                          </p>
                                          <div className="flex items-center gap-2 mt-1">
                                                 <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                                 <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Master Identity</span>
                                          </div>
                                   </div>
                            </div>

                            <button
                                   onClick={() => signOut()}
                                   className="group flex items-center gap-4 px-6 py-4 w-full rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-500 text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-rose-500/5"
                            >
                                   <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                   <span>Cerrar Sesión</span>
                            </button>
                     </div>
              </aside>
       );
}
