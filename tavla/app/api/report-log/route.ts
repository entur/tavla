import { type NextRequest, NextResponse } from 'next/server'
import { logToGcp } from 'src/utils/logging'
import rateLimit from 'src/utils/rateLimit'
import { clientIp } from 'utils/clientIp'
import { z } from 'zod'

const ALLOWED_ORIGINS = [
    'https://vis-tavla.entur.no',
    'https://vis-tavla.dev.entur.no',
    ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:5173'] : []),
]

const ReportLevel = z.enum(['debug', 'info', 'warning', 'error'])

const ReportCode = z.enum([
    'display_error',
    'unknown',
    'fetch_journey_planner',
    'fetch_board',
])

const ReportSchema = z.object({
    boardId: z
        .string()
        .regex(/^[A-Za-z0-9]{20}$/)
        .or(z.string().regex(/^NSR:(Quay|StopPlace):\d+$/i)),
    level: ReportLevel,
    code: ReportCode,
    message: z.string(),
    errorName: z.string().optional(),
    online: z.boolean().optional(),
})

// Limits live in the memory of the pods. These are not hard limits, but work as per-instance LRU limiters.
// Good to keep in mind as it can be abused to spam logs, but the risk is low.
// Boards report every 30s regardless of outcome (2 calls/min steady-state per board), so limits
// must comfortably clear that baseline rather than just absorb occasional error bursts.
const ipLimiter = rateLimit({ maxUniqueTokens: 2000, interval: 60000 })
const boardLimiter = rateLimit({ maxUniqueTokens: 2000, interval: 60000 })

function corsHeaders(origin: string): Record<string, string> {
    if (!ALLOWED_ORIGINS.includes(origin)) return {}
    return { 'Access-Control-Allow-Origin': origin }
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin') ?? ''
    const headers = corsHeaders(origin)

    const contentLength = Number(req.headers.get('Content-Length') ?? '0')
    if (contentLength > 520) {
        return NextResponse.json(
            { error: 'invalid request: Content-Length' },
            { status: 400, headers },
        )
    }

    const contentType = req.headers.get('Content-Type') ?? ''
    if (contentType !== 'application/json') {
        return NextResponse.json(
            { error: 'invalid request: Content-Type' },
            { status: 400, headers },
        )
    }

    const userAgent = req.headers.get('User-Agent') ?? 'unknown User-Agent'

    const body = await req.json().catch(() => null)
    const parsed = ReportSchema.safeParse(body)

    if (!parsed.success) {
        return NextResponse.json(
            { error: 'invalid request' },
            { status: 400, headers },
        )
    }

    const { boardId, level, code, message, errorName, online } = parsed.data
    const ip = clientIp(req)

    try {
        await ipLimiter.check(new Response(), 150, ip)
        await boardLimiter.check(new Response(), 50, boardId)
    } catch {
        await logToGcp('warning', 'report rejected: rate limited', {
            type: 'tavla-visning',
            method: 'POST',
            path: '/api/report-log',
            status: 429,
            bid: boardId,
            errorCode: code,
            userAgent,
        })
        return NextResponse.json(
            { error: 'rate limited' },
            { status: 429, headers },
        )
    }

    await logToGcp(level, `[tavla-visning] ${code}`, {
        type: 'tavla-visning',
        method: 'POST',
        path: '/api/report-log',
        bid: boardId,
        errorCode: code,
        errorName,
        errorMessage: message,
        userAgent,
        context: online !== undefined ? { online } : undefined,
    })

    return NextResponse.json({ ok: true }, { headers })
}

export async function OPTIONS(req: NextRequest) {
    const origin = req.headers.get('origin') ?? ''
    if (!ALLOWED_ORIGINS.includes(origin)) {
        return new NextResponse(null, { status: 204 })
    }
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    })
}
