import { NextResponse, userAgent } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from 'utils/logger'

const log = logger.child({ module: 'middleware' })
export function middleware(request: NextRequest) {
    const response = NextResponse.next()
    log.trace({
        request: {
            browser: userAgent(request).browser,
            device: userAgent(request).device,
            url: request.url,
            path: request.nextUrl.pathname,
            method: request.method,
        },
        response: {
            status: response.status,
            body: response.body,
        },
    })
    return response
}

export const config = {
    matcher: ['/:id(\\w{20})'],
}
