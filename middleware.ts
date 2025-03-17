import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Get token from cookies (or you could check localStorage on client-side)
    const token = request.cookies.get('token')?.value;

    // Check if user is trying to access login or register pages
    if (pathname === '/login' || pathname === '/register') {
        if (token) {
            // If user is logged in, redirect to home page
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // If no redirect needed, continue with the request
    return NextResponse.next();
}

// Configure which paths this middleware should apply to
export const config = {
    matcher: ['/login', '/register'],
};