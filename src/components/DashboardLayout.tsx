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

                     {/* Main Content */}
                     <main className={cn(
                            "flex-1 relative z-10 transition-all duration-300",
                            // Mobile: top padding for header + bottom padding for nav
                            "pt-14 pb-20 lg:pb-0",
                            // Desktop: left margin for sidebar, no top padding
                            "lg:ml-64 lg:pt-0"
                     )}>
                            <div className="max-w-[1600px] mx-auto min-h-screen">
                                   <AnimatePresence mode="wait">
                                          <motion.div
                                                 key={pathname}
                                                 initial={{ opacity: 0, y: 6 }}
                                                 animate={{ opacity: 1, y: 0 }}
                                                 exit={{ opacity: 0, y: -6 }}
                                                 transition={{ duration: 0.2, ease: "easeOut" }}
                                                 className="h-full"
                                          >
                                                 {children}
                                          </motion.div>
                                   </AnimatePresence>
                            </div>
                     </main>

                     {/* Mobile Bottom Nav */}
                     <MobileNav />
              </div>
       );
}
