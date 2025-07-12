import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const url = req.nextUrl
  
  console.log('[Middleware] Pathname:', req.nextUrl.pathname)

  if (url.pathname.startsWith('/auth/callback')) return res

  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session }
  } = await supabase.auth.getSession()


  // ✅ Allow homepage publicly
  if (url.pathname === '/') return res

  
  if (!session) {
    const isFirstOpen = req.cookies.get('first_open')?.value !== 'false'
    url.pathname = isFirstOpen ? '/signup' : '/login'
    return NextResponse.redirect(url)
  }

  // ✅ Fetch kindred row
  const { data: kindred, error: kindredError } = await supabase
    .from('kindred')
    .select('name')
    .eq('id', session.user.id)
    .maybeSingle()

  if (kindredError && !url.pathname.startsWith('/onboarding')) {
    console.error('Kindred fetch error in middleware:', kindredError)
    url.pathname = '/onboarding/start'
    return NextResponse.redirect(url)
  }

  const hasKindredName = kindred?.name?.trim()

  if ((!kindred || !hasKindredName) && !url.pathname.startsWith('/onboarding')) {
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
      if (isComplete && url.pathname === '/kindred') {
        url.pathname = '/dashboard'
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
