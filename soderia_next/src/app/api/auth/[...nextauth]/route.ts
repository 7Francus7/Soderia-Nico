import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
       providers: [
              CredentialsProvider({
                     name: "Credentials",
                     credentials: {
                            username: { label: "Usuario", type: "text" },
                            password: { label: "Password", type: "password" }
                     },
                     async authorize(credentials) {
                            if (!credentials?.username || !credentials?.password) return null;

                            const user = await prisma.user.findUnique({
                                   where: { username: credentials.username }
                            });

                            if (!user || !user.isActive) return null;

                            const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

                            if (!passwordMatch) return null;

                            return {
                                   id: user.id.toString(),
                                   name: user.fullName,
                                   email: user.username,
                                   role: user.role
                            };
                     }
              })
       ],
       callbacks: {
              async jwt({ token, user }: any) {
                     if (user) {
                            token.role = user.role;
                            token.id = user.id;
                     }
                     return token;
              },
              async session({ session, token }: any) {
                     if (session.user) {
                            (session.user as any).role = token.role;
                            (session.user as any).id = token.id;
                     }
                     return session;
              }
       },
       pages: {
              signIn: "/login",
       },
       session: {
              strategy: "jwt",
       },
       secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev",
});

export { handler as GET, handler as POST };
