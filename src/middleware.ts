import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware (request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}

/*
import { NextResponse } from 'next/server'
import { authMiddleware, redirectToSignIn } from '@clerk/nextjs'
// import { NextResponse } from 'next/server'

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware

export default authMiddleware({
  publicRoutes: ['/', '/forgot-password', '/api/facultades', '/api/programas', '/api/tipos-documento', '/api/sexos', '/api/roles', '/api/estados', '/api/empleados', '/api/estudiantes', '/api/estudiantes/verificar', '/api/estudiantes/verificar/correo', '/api/estudiantes/cambio-clave'],

  afterAuth (auth, req) {
    const isPublicRoute = auth.isPublicRoute
    const pathStudentHome = '/profile/student/home'

    if (auth.userId === null && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }

    if (auth.userId !== null &&
      (auth.orgId === null || auth.orgId === undefined) &&
      isPublicRoute
    ) {
      const pathStudentHomeURL = new URL(pathStudentHome, req.url)
      return NextResponse.redirect(pathStudentHomeURL)
    }
  }
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
*/
