"use strict";
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./navigation/Sidebar";
import MobileNav from "./navigation/MobileNav";
import MobileHeader from "./navigation/MobileHeader";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
       const pathname = usePathname();
       const isLoginPage = pathname === "/login";

       if (isLoginPage) {
              return <>{children}</>;
       }

       return (
              <div className="flex min-h-screen bg-black font-sans selection:bg-white selection:text-black overflow-x-hidden">
                     {/* PREMIUM BACKGROUND EFFECTS */}
                     <div className="fixed inset-0 pointer-events-none z-0">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_100%)]" />
                            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none mix-blend-overlay"
                                   style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                     </div>

                     <Sidebar />
                     <MobileHeader />

                     <main className={cn(
                            "flex-1 relative z-10 transition-all duration-700 ease-in-out pb-20 lg:pb-0",
                            "lg:ml-80 pt-16 lg:pt-0"
                     )}>
                            <div className="max-w-[1920px] mx-auto min-h-screen">
                                   <AnimatePresence mode="wait">
                                          <motion.div
                                                 key={pathname}
                                                 initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                                                 animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                                 exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                                                 transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                                 className="h-full"
                                          >
                                                 {children}
                                          </motion.div>
                                   </AnimatePresence>
                            </div>
                     </main>

                     <MobileNav />
              </div>
       );
}
