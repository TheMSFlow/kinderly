import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

function getSelectedKin(req) {
  const raw = req.cookies.get('selectedKin')?.value
  try {
    return JSON.parse(decodeURIComponent(raw))
  } catch (err) {
    console.error('[Middleware] Failed to parse selectedKin cookie:', err)
    return null
  }
}

export async function middleware(req) {
  const res = NextResponse.next()
  const url = req.nextUrl
  const pathname = url.pathname

  const supabase = createMiddlewareClient({ req, res })

  // ✅ Safe session retrieval with try/catch
  let session = null
  try {
    const { data } = await supabase.auth.getSession()
    session = data.session
  } catch (err) {
    console.error('[Middleware] Failed to get session:', err)
  }

  // ✅ Allow public access to homepage and auth callback
  if (pathname === '/' || pathname.startsWith('/auth/callback')) return res

  // ✅ Redirect unauthenticated users
  if (!session) {
    const isFirstOpen = req.cookies.get('first_open')?.value === 'true'
    url.pathname = isFirstOpen ? '/signup' : '/login'
    return NextResponse.redirect(url)
  }

  const userId = session.user.id

  // ✅ Fetch kindred name safely
  let hasKindredName = false
  try {
    const { data: kindred, error } = await supabase
      .from('kindred')
      .select('name')
      .eq('id', userId)
      .maybeSingle()

    hasKindredName = !!kindred?.name?.trim()
  } catch (err) {
    console.error('[Middleware] Failed to fetch kindred name:', err)
  }

  // ✅ Redirect to onboarding if no kindred name
  if (!hasKindredName && !pathname.startsWith('/onboarding')) {
    url.pathname = '/onboarding/start'
    return NextResponse.redirect(url)
  }

  // ✅ Redirect `/onboarding/start` ➝ `/onboarding/profile` if name exists
  if (hasKindredName && pathname === '/onboarding/start') {
    url.pathname = '/onboarding/profile'
    return NextResponse.redirect(url)
  }

  // ✅ Protect completed kin routes
  const protectedRoutes = ['/dashboard', '/events', '/profile']
  let selectedKinStatus = null

  if (protectedRoutes.includes(pathname)) {
    const selectedKin = getSelectedKin(req)
    const kinId = selectedKin?.id

    if (!kinId) {
      url.pathname = '/kindred'
      return NextResponse.redirect(url)
    }

    try {
      const { data: kin, error } = await supabase
        .from('kin')
        .select('status')
        .eq('id', kinId)
        .maybeSingle()

      if (error || !kin?.status) {
        url.pathname = '/kindred'
        return NextResponse.redirect(url)
      }

      selectedKinStatus = kin.status
    } catch (err) {
      console.error('[Middleware] Failed to fetch kin status:', err)
      url.pathname = '/kindred'
      return NextResponse.redirect(url)
    }
  }

  // ✅ If completed kin is selected, redirect `/kindred` ➝ `/dashboard`
  if (pathname === '/kindred') {
    const selectedKin = getSelectedKin(req)
    const kinId = selectedKin?.id

    if (selectedKinStatus === true) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    if (kinId && selectedKinStatus === null) {
      try {
        const { data: kin, error } = await supabase
          .from('kin')
          .select('status')
          .eq('id', kinId)
          .maybeSingle()

        if (!error && kin?.status === true) {
          url.pathname = '/dashboard'
          return NextResponse.redirect(url)
        }
      } catch {
        // Allow to continue showing `/kindred`
      }
    }
  }

  return res
}

export const config = {
  matcher: [
    '/',
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
