import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import RootProvider from "@/components/providers/RootProvider";
import { getServerSession } from "next-auth/next"
import "./globals.css";

const font = Plus_Jakarta_Sans({
       variable: "--font-sans",
       subsets: ["latin"],
});

export const metadata: Metadata = {
       title: "Sodería Nico - Gestión Inteligente",
       description: "Sistema integral de gestión para Sodería Nico. Repartos, Clientes y Finanzas.",
};

export const viewport: Viewport = {
       themeColor: "#7c3aed",
       width: "device-width",
       initialScale: 1,
       maximumScale: 1,
       userScalable: false,
};

export default async function RootLayout({
       children,
}: Readonly<{
       children: React.ReactNode;
}>) {
       const session = await getServerSession();

       return (
              <html lang="es" suppressHydrationWarning>
                     <body
                            className={`${font.variable} font-sans antialiased`}
                     >
                            <RootProvider session={session}>
                                   {children}
                            </RootProvider>
                     </body>
              </html>
       );
}
