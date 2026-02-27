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
              <div className="flex min-h-screen bg-background font-sans selection:bg-primary/10">
                     <Sidebar />
                     <MobileHeader />

                     <main className={cn(
                            "flex-1 relative z-10 transition-all duration-500",
                            "lg:ml-72 pt-16 lg:pt-0 pb-20 lg:pb-0"
                     )}>
                            <div className="max-w-7xl mx-auto min-h-screen p-4 lg:p-12">
                                   <AnimatePresence mode="wait">
                                          <motion.div
                                                 key={pathname}
                                                 initial={{ opacity: 0, y: 8 }}
                                                 animate={{ opacity: 1, y: 0 }}
                                                 exit={{ opacity: 0, y: -8 }}
                                                 transition={{ duration: 0.2, ease: "easeInOut" }}
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
