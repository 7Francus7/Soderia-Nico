"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./navigation/Sidebar";
import MobileNav from "./navigation/MobileNav";
import MobileHeader from "./navigation/MobileHeader";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
       const pathname = usePathname();
       const isLoginPage = pathname === "/login";

       if (isLoginPage) {
              return <>{children}</>;
       }

       return (
              <div className="flex min-h-screen bg-background selection:bg-primary/20">
                     {/* Background decoration */}
                     <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                            <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                     </div>

                     <Sidebar />
                     <MobileHeader />

                     <main className={cn(
                            "flex-1 relative z-10 transition-all duration-500",
                            "lg:ml-72 pt-16 lg:pt-0 pb-24 lg:pb-0"
                     )}>
                            <div className="max-w-[1600px] mx-auto min-h-screen">
                                   {children}
                            </div>
                     </main>

                     <MobileNav />
              </div>
       );
}
