import { type NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
    return NextResponse.next({
        request: {
            headers: new Headers({
                ...Object.fromEntries(request.headers),
                'x-pathname': request.nextUrl.pathname,
            }),
        },
    })
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon|.*\\..*).*)'],
}
