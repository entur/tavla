import type { NextRequest } from 'next/server'

// Google Cloud Load Balancer appends the real client IP as the rightmost entry in XFF
// Assumtion: GCLB sits right infront of the application. If anything else proxies the request,
// update proxyDepth accordingly.
// Everything left of this appended IP is client controlled and not to be trusted.
const PROXY_DEPTH = 1

export function clientIp(req: NextRequest): string {
    const xff = req.headers.get('x-forwarded-for') ?? ''
    const parts = xff
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
    return parts[parts.length - PROXY_DEPTH] ?? 'unknown'
}
