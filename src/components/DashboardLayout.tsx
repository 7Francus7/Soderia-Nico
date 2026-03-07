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
              <div className="flex min-h-screen bg-background font-sans overflow-x-hidden">
                     {/* Desktop Sidebar */}
                     <Sidebar />

                     {/* Mobile Header (top bar) */}
                     <MobileHeader />

                     {/* Main Content Area */}
                     <main className={cn(
                            "flex-1 relative z-10 transition-all duration-300 min-h-screen flex flex-col",
                            // Mobile: top padding for header + bottom padding for nav
                            "pt-16 pb-24 lg:pb-0",
                            // Desktop: left margin for sidebar, no top padding
                            "lg:ml-64 lg:pt-0"
                     )}>
                            <div className="flex-1 w-full max-w-[1600px] mx-auto bg-white/50 lg:bg-transparent">
                                   <AnimatePresence mode="wait">
                                          <motion.div
                                                 key={pathname}
                                                 initial={{ opacity: 0, y: 10 }}
                                                 animate={{ opacity: 1, y: 0 }}
                                                 exit={{ opacity: 0, y: -10 }}
                                                 transition={{ duration: 0.25, ease: "easeOut" }}
                                                 className="h-full"
                                          >
                                                 {children}
                                          </motion.div>
                                   </AnimatePresence>
                            </div>

                            {/* Optional page-level shadow divider for very wide screens */}
                            <div className="hidden 2xl:block fixed top-0 bottom-0 left-64 w-px bg-border/50" />
                     </main>

                     {/* Mobile Bottom Nav */}
                     <MobileNav />
              </div>
       );
}
