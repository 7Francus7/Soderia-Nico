import { withAuth } from "next-auth/middleware";

export default withAuth({
       pages: {
              signIn: "/login",
       },
});

export const config = {
       matcher: [
              "/",
              "/clientes/:path*",
              "/pedidos/:path*",
              "/repartos/:path*",
              "/caja/:path*",
              "/cuentas/:path*",
              "/productos/:path*",
              "/((?!api|login|_next/static|_next/image|favicon.ico).*)",
       ],
};
