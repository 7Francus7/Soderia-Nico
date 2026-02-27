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
                                   <Toaster position="top-center" richColors />
                            </ThemeProvider>
                     </QueryClientProvider>
              </SessionProvider>
       )
}
