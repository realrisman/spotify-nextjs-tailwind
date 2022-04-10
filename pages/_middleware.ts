import { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest & NextApiRequest) {
  // Token will exist if user is logged in
  const token = await getToken({
    req: req,
    secret: process.env.JWT_SECRET!,
  })

  const { pathname } = req.nextUrl

  // Allow the request if the following is true...
  // 1) Its a request for next-auth session & provider fetching
  // 2) The token exists
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  // Redirect them to login if they dont have token AND are requesting a protected route
  if (!token && pathname !== '/login') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.rewrite(url)
  }
}
