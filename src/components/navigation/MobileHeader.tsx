"use strict";

import { Droplets, User, Bell } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function MobileHeader() {
       const { data: session } = useSession();
       const [showProfile, setShowProfile] = useState(false);

       return (
              <>
                     <header className="fixed top-0 left-0 right-0 h-14 bg-white/70 backdrop-blur-md z-[140] border-b border-border/50 lg:hidden px-4 flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2 active:scale-95 transition-transform">
                                   <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm ring-4 ring-primary/5">
                                          <Droplets className="w-4 h-4 fill-current" />
                                   </div>
                                   <div className="flex flex-col">
                                          <span className="text-xs font-extrabold tracking-tight text-foreground uppercase">Sodería Nico</span>
                                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">ADMINISTRACIÓN</span>
                                   </div>
                            </Link>

                            <div className="flex items-center gap-2">
                                   <button className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
                                          <Bell className="w-4 h-4" />
                                   </button>
                                   <button
                                          onClick={() => setShowProfile(true)}
                                          className="w-9 h-9 rounded-full bg-secondary border border-border/50 flex items-center justify-center text-muted-foreground active:scale-90 transition-all overflow-hidden"
                                   >
                                          {session?.user?.image ? (
                                                 <img src={session.user.image} alt="User" />
                                          ) : (
                                                 <User className="w-4 h-4" />
                                          )}
                                   </button>
                            </div>
                     </header>

                     {/* Profile Drawer */}
                     <AnimatePresence>
                            {showProfile && (
                                   <div className="fixed inset-0 z-[200] flex items-end justify-center lg:hidden">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                                                 onClick={() => setShowProfile(false)}
                                          />
                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                                 className="relative w-full bg-white rounded-t-3xl border-t border-border p-8 pb-12 shadow-2xl flex flex-col items-center"
                                          >
                                                 <div className="w-12 h-1 bg-secondary rounded-full mb-8" />

                                                 <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                                                        <User className="w-8 h-8" />
                                                 </div>

                                                 <h3 className="text-lg font-bold text-foreground">{session?.user?.name || "Administrador"}</h3>
                                                 <p className="text-xs font-medium text-muted-foreground mb-8">{session?.user?.email || "operaciones@soderianico.com"}</p>

                                                 <div className="w-full space-y-3">
                                                        <Link href="/usuarios" onClick={() => setShowProfile(false)}>
                                                               <Button variant="secondary" className="w-full justify-between h-12 rounded-xl">
                                                                      Mi Cuenta <User className="w-4 h-4 opacity-50" />
                                                               </Button>
                                                        </Link>

                                                        <Button
                                                               variant="destructive"
                                                               className="w-full justify-between h-12 rounded-xl"
                                                               onClick={() => signOut()}
                                                        >
                                                               Cerrar Sesión <Droplets className="w-4 h-4 opacity-50" />
                                                        </Button>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </>
       );
}
