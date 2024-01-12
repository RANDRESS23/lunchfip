import { authMiddleware } from '@clerk/nextjs'
// import { NextResponse } from 'next/server'

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ['/', '/api/facultades', '/api/programas', '/api/tipos-documento', '/api/sexos', '/api/estudiantes', '/api/estados']
  // afterAuth (auth, req) {
  //   if (auth.userId !== null && auth.isPublicRoute !== null) {
  //     const path = '/select-org'

  //     const orgSelection = new URL(path, req.url)
  //     return NextResponse.redirect(orgSelection)
  //   }

  //   if (auth.userId === null && auth.isPublicRoute === null) {
  //     return redirectToSignIn({ returnBackUrl: req.url })
  //   }

  //   if (auth.userId !== null && req.nextUrl.pathname !== '/select-org') {
  //     const orgSelection = new URL('/select-org', req.url)
  //     return NextResponse.redirect(orgSelection)
  //   }
  // }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
