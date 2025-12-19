import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected Routes Definition
    const path = request.nextUrl.pathname
    const isProtected =
        path.startsWith('/admin') ||
        path.startsWith('/office') ||
        path.startsWith('/teacher') ||
        path.startsWith('/student')

    if (isProtected && !user) {
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    if (user) {
        // Fetch Role from DB for security (Metadata is faster but DB is source of truth)
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = userData?.role || 'student' // Fallback to student if not found

        // Strict Role-Based Access Control
        if (path.startsWith('/admin') && role !== 'admin') {
            await supabase.auth.signOut()
            return NextResponse.redirect(new URL('/auth', request.url))
        }

        if (path.startsWith('/office') && role !== 'office') {
            await supabase.auth.signOut()
            return NextResponse.redirect(new URL('/auth', request.url))
        }

        if (path.startsWith('/teacher') && role !== 'teacher') {
            await supabase.auth.signOut()
            return NextResponse.redirect(new URL('/auth', request.url))
        }

        if (path.startsWith('/student') && role !== 'student') {
            await supabase.auth.signOut()
            return NextResponse.redirect(new URL('/auth', request.url))
        }

        // Redirect from /auth (login page) if already logged in
        if (path.startsWith('/auth') && !path.startsWith('/auth/signout')) { // Allow signout
            if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            if (role === 'office') return NextResponse.redirect(new URL('/office/dashboard', request.url))
            if (role === 'teacher') return NextResponse.redirect(new URL('/teacher/dashboard', request.url))
            if (role === 'student') return NextResponse.redirect(new URL('/student/dashboard', request.url))
        }
    }

    return response
}
