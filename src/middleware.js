
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
    function middleware(req) {
        // console.log(req.nextauth.token);
        // console.log(req)
        // console.log(req.nextUrl)
      if (
        (req.nextUrl.pathname.startsWith("/menus") ||
        req.nextUrl.pathname.startsWith("/users")) &&
        !req.nextauth.token.isAdmin
      ) {
        // new URL(url, base)

        // return NextResponse.rewrite(new URL("/denied", req.url));
        return NextResponse.redirect(new URL(req.nextUrl.origin));
      }
    },
    {
      callbacks: {
        authorized: ({ token }) => !!token,
      },
    }
  );
  
  export const config = { matcher: ["/profile", "/orders", "/menus", "/users", "/checkout"] };