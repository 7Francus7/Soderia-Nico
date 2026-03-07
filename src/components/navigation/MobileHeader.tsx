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
                     <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl z-[140] border-b border-border lg:hidden px-6 flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                                   <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
                                          <Droplets className="w-5 h-5" />
                                   </div>
                                   <div className="flex flex-col">
                                          <span className="text-sm font-bold tracking-tight text-foreground uppercase">Sodería Nico</span>
                                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-none mt-0.5">{new Date().toLocaleDateString('es-AR', { weekday: 'long' })}</span>
                                   </div>
                            </Link>

                            <div className="flex items-center gap-3">
                                   <button className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground active:bg-secondary transition-colors">
                                          <Bell className="w-5 h-5" />
                                   </button>
                                   <button
                                          onClick={() => setShowProfile(true)}
                                          className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground active:scale-95 transition-all overflow-hidden"
                                   >
                                          {session?.user?.image ? (
                                                 <img src={session.user.image} alt="User" />
                                          ) : (
                                                 <User className="w-5 h-5" />
                                          )}
                                   </button>
                            </div>
                     </header>

                     {/* Profile Modal */}
                     <AnimatePresence>
                            {showProfile && (
                                   <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center lg:hidden p-4">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                                 onClick={() => setShowProfile(false)}
                                          />
                                          <motion.div
                                                 initial={{ y: "100%", opacity: 0 }}
                                                 animate={{ y: 0, opacity: 1 }}
                                                 exit={{ y: "100%", opacity: 0 }}
                                                 transition={{ duration: 0.3, ease: "easeOut" }}
                                                 className="relative w-full max-w-sm bg-card rounded-2xl p-8 shadow-2xl flex flex-col items-center border border-border"
                                          >
                                                 <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-sm">
                                                        <User className="w-10 h-10" />
                                                 </div>

                                                 <h3 className="text-xl font-bold text-foreground mb-1">{session?.user?.name || "Administrador"}</h3>
                                                 <p className="text-sm font-medium text-muted-foreground mb-8 text-center">{session?.user?.email || "admin@soderianico.com"}</p>

                                                 <div className="w-full space-y-3">
                                                        <Link
                                                               href="/usuarios"
                                                               onClick={() => setShowProfile(false)}
                                                               className="w-full h-12 bg-secondary flex items-center justify-between px-5 rounded-xl border border-border active:bg-secondary/70 transition-colors"
                                                        >
                                                               <span className="font-bold text-foreground text-sm uppercase tracking-wide">Mi Perfil</span>
                                                               <User className="w-4 h-4 text-muted-foreground" />
                                                        </Link>

                                                        <button
                                                               onClick={() => signOut()}
                                                               className="w-full h-12 bg-rose-50 flex items-center justify-between px-5 rounded-xl border border-rose-100 active:bg-rose-100 transition-colors group"
                                                        >
                                                               <span className="font-bold text-rose-600 text-sm uppercase tracking-wide">Cerrar Sesión</span>
                                                               <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shadow-sm group-active:scale-95 transition-transform">
                                                                      <Droplets className="w-4 h-4" />
                                                               </div>
                                                        </button>

                                                        <button
                                                               onClick={() => setShowProfile(false)}
                                                               className="w-full h-10 flex items-center justify-center font-bold text-muted-foreground/60 text-[10px] uppercase tracking-widest pt-4"
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
