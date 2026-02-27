"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { useState } from "react"

export default function RootProvider({
       children,
       session,
}: {
       children: React.ReactNode
       session: any
}) {
       const [queryClient] = useState(() => new QueryClient())

       return (
              <SessionProvider session={session}>
                     <QueryClientProvider client={queryClient}>
                            <ThemeProvider
                                   attribute="class"
                                   defaultTheme="system"
                                   enableSystem
                                   disableTransitionOnChange
                            >
                                   {children}
                                   <Toaster
                                          position="top-right"
                                          richColors
                                          theme="dark"
                                          toastOptions={{
                                                 className: "rounded-[1.5rem] border-white/5 bg-slate-900/90 backdrop-blur-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl",
                                                 style: {
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                 }
                                          }}
                                   />
                            </ThemeProvider>
                     </QueryClientProvider>
              </SessionProvider>
       )
}
