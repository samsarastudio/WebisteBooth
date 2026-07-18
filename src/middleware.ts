import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Canonical host: redirect www → apex so crawlers and typed URLs share one origin.
 * Requires a Cloudflare DNS record for www (CNAME → apex or proxied) — see DEPLOY.md.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase()
  if (!host || !host.startsWith('www.')) {
    return NextResponse.next()
  }

  const apexHost = host.slice(4)
  const url = request.nextUrl.clone()
  url.hostname = apexHost
  url.protocol = 'https:'
  url.port = ''

  return NextResponse.redirect(url, 308)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/media).*)'],
}
