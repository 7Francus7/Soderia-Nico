"use client";

import { Droplets, User, Bell, Search } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function MobileHeader() {
       const { data: session } = useSession();
       const pathname = usePathname();
       const [showProfile, setShowProfile] = useState(false);

       return (
              <>
                     <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl z-[140] border-b border-border/40 lg:hidden px-6 flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                                   <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                          <Droplets className="w-5.5 h-5.5" />
                                   </div>
                                   <div className="flex flex-col -gap-1">
                                          <span className="text-sm font-bold tracking-tight text-foreground uppercase">Sodería Nico</span>
                                          <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">{new Date().toLocaleDateString('es-AR', { weekday: 'long' })}</span>
                                   </div>
                            </Link>

                            <div className="flex items-center gap-4">
                                   <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground/80 active:bg-slate-100 transition-colors">
                                          <Bell className="w-5 h-5" />
                                   </button>
                                   <button
                                          onClick={() => setShowProfile(true)}
                                          className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 active:scale-95 transition-all overflow-hidden shadow-inner"
                                   >
                                          {session?.user?.image ? (
                                                 <img src={session.user.image} alt="User" />
                                          ) : (
                                                 <User className="w-5.5 h-5.5" />
                                          )}
                                   </button>
                            </div>
                     </header>

                     {/* iOS Profile Sheet */}
                     <AnimatePresence>
                            {showProfile && (
                                   <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center lg:hidden">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                                                 onClick={() => setShowProfile(false)}
                                          />
                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                                 className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] p-8 pb-12 shadow-2xl flex flex-col items-center"
                                          >
                                                 {/* Handle */}
                                                 <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-8" />

                                                 <div className="w-24 h-24 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-inner">
                                                        <User className="w-12 h-12" />
                                                 </div>

                                                 <h3 className="text-xl font-bold text-foreground mb-1">{session?.user?.name || "Administrador"}</h3>
                                                 <p className="text-sm font-medium text-muted-foreground mb-8 text-center">{session?.user?.email || "admin@soderianico.com"}</p>

                                                 <div className="w-full space-y-3">
                                                        <Link
                                                               href="/usuarios"
                                                               onClick={() => setShowProfile(false)}
                                                               className="w-full h-14 bg-slate-50 flex items-center justify-between px-6 rounded-2xl border border-slate-100 active:bg-slate-100 transition-colors"
                                                        >
                                                               <span className="font-bold text-foreground text-sm uppercase tracking-wide">Mi Perfil</span>
                                                               <User className="w-5 h-5 text-muted-foreground/30" />
                                                        </Link>

                                                        <button
                                                               onClick={() => signOut()}
                                                               className="w-full h-14 bg-rose-50 flex items-center justify-between px-6 rounded-2xl border border-rose-100 active:bg-rose-100 transition-colors group"
                                                        >
                                                               <span className="font-bold text-rose-600 text-sm uppercase tracking-wide">Cerrar Sesión</span>
                                                               <div className="w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200 group-active:scale-95 transition-transform">
                                                                      <Droplets className="w-4 h-4" />
                                                               </div>
                                                        </button>

                                                        <button
                                                               onClick={() => setShowProfile(false)}
                                                               className="w-full h-14 flex items-center justify-center font-bold text-muted-foreground/50 text-xs uppercase tracking-[0.2em] pt-4"
                                                        >
                                                               Cancelar
                                                        </button>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </>
       );
}
