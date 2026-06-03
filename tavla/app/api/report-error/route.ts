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

const ErrorCode = z.enum(['display_error', 'unknown'])

const ReportSchema = z.object({
    boardId: z.string().regex(/^[A-Za-z0-9]{20}$/),
    errorCode: ErrorCode,
})

//Limits live in the memory of the pods. These are not hard limits, but work as per-instance LRU limiters.
//Good to keep in mind as it can be abused to spam logs, but the risk is low.
const ipLimiter = rateLimit({ maxUniqueTokens: 500, interval: 60000 })
const boardLimiter = rateLimit({ maxUniqueTokens: 2000, interval: 60000 })

function corsHeaders(origin: string): Record<string, string> {
    if (!ALLOWED_ORIGINS.includes(origin)) return {}
    return { 'Access-Control-Allow-Origin': origin }
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin') ?? ''
    const headers = corsHeaders(origin)

    const contentLength = Number(req.headers.get('Content-Length') ?? '0')
    if (contentLength > 500) {
        return NextResponse.json(
            { error: 'invalid request' },
            { status: 400, headers },
        )
    }

    const contentType = req.headers.get('Content-Type') ?? ''
    if (contentType !== 'application/json') {
        return NextResponse.json(
            { error: 'invalid request' },
            { status: 400, headers },
        )
    }

    const body = await req.json().catch(() => null)
    const parsed = ReportSchema.safeParse(body)

    if (!parsed.success) {
        return NextResponse.json(
            { error: 'invalid request' },
            { status: 400, headers },
        )
    }

    const { boardId, errorCode } = parsed.data
    const ip = clientIp(req)

    try {
        await ipLimiter.check(new Response(), 100, ip)
        await boardLimiter.check(new Response(), 5, boardId)
    } catch {
        logToGcp('warning', `POST /api/report-error: status=429 bid=${boardId}`)
        return NextResponse.json(
            { error: 'rate limited' },
            { status: 429, headers },
        )
    }

    await logToGcp(
        'error',
        `POST /api/report-error: status=200 errorCode=${errorCode}`,
        { bid: boardId },
    )

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
