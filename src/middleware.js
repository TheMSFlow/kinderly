import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  console.log('[Middleware] Pathname:', req.nextUrl.pathname)
  
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const url = req.nextUrl

  const {
    data: { session }
  } = await supabase.auth.getSession()

  // ✅ Allow homepage publicly
  if (url.pathname === '/') return res

  // ✅ Handle first-time logic
  const isFirstOpen = req.cookies.get('first_open')?.value !== 'false'

  if (!session) {
    url.pathname = isFirstOpen ? '/signup' : '/login'
    return NextResponse.redirect(url)
  }

  // ✅ Fetch kindred row
  const { data: kindred, error: kindredError } = await supabase
    .from('kindred')
    .select('name')
    .eq('id', session.user.id)
    .maybeSingle()

  if (kindredError || !kindred) {
    console.error('Kindred fetch error in middleware:', kindredError)
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const hasKindredName = kindred.name?.trim()

  if (!hasKindredName && !url.pathname.startsWith('/onboarding')) {
    url.pathname = '/onboarding/start'
    return NextResponse.redirect(url)
  }

  if (hasKindredName && url.pathname === '/onboarding/start') {
    url.pathname = '/onboarding/profile'
    return NextResponse.redirect(url)
  }

  // ✅ Kin-completion required routes
  const needsCompletedKin = ['/dashboard', '/events', '/profile']
  if (needsCompletedKin.includes(url.pathname)) {
    const selectedKinRaw = req.cookies.get('selectedKin')?.value

    if (!selectedKinRaw) {
      url.pathname = '/kindred'
      return NextResponse.redirect(url)
    }

    try {
      const selectedKin = JSON.parse(decodeURIComponent(selectedKinRaw))

      const isComplete = selectedKin?.name && selectedKin?.role && selectedKin?.pin
      if (!isComplete) {
        url.pathname = '/kindred'
        return NextResponse.redirect(url)
      }
    } catch (err) {
      console.error('Invalid selectedKin cookie:', err)
      url.pathname = '/kindred'
      return NextResponse.redirect(url)
    }
  }

  return res
}

export const config = {
  matcher: [
    '/onboarding',
    '/onboarding/:path*',
    '/kindred',
    '/dashboard',
    '/dashboard/:path*',
    '/events',
    '/events/:path*',
    '/profile',
    '/profile/:path*',
  ],
}
