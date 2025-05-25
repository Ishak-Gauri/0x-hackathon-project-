import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages and API routes without token
        if (req.nextUrl.pathname.startsWith("/auth/") || req.nextUrl.pathname.startsWith("/api/auth/")) {
          return true
        }

        // For protected API routes, require authentication
        if (req.nextUrl.pathname.startsWith("/api/")) {
          return !!token
        }

        // For all other pages, allow access (we handle auth in components)
        return true
      },
    },
  },
)

export const config = {
  matcher: ["/api/:path*", "/auth/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}
