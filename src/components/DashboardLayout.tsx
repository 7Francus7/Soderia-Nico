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
              <div className="flex min-h-screen bg-background selection:bg-primary/20 overflow-x-hidden">
                     {/* UI-UX-PRO-MAX Dynamic Background */}
                     <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                            <div
                                   className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[160px] animate-blob"
                            />
                            <div
                                   className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[140px] animate-blob"
                                   style={{ animationDelay: '2s' }}
                            />
                            <div
                                   className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-sky-500/5 rounded-full blur-[100px] animate-blob"
                                   style={{ animationDelay: '4s' }}
                            />
                     </div>

                     <Sidebar />
                     <MobileHeader />

                     <main className={cn(
                            "flex-1 relative z-10 transition-all duration-700",
                            "lg:ml-80 pt-16 lg:pt-0 pb-24 lg:pb-0"
                     )}>
                            <div className="max-w-[1700px] mx-auto min-h-screen p-4 lg:p-8">
                                   <AnimatePresence mode="wait">
                                          <motion.div
                                                 key={pathname}
                                                 initial={{ opacity: 0, y: 10 }}
                                                 animate={{ opacity: 1, y: 0 }}
                                                 exit={{ opacity: 0, y: -10 }}
                                                 transition={{ duration: 0.3, ease: "easeOut" }}
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
