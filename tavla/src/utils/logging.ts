'use server'
import { Logging } from '@google-cloud/logging'

export type LogLevel = 'debug' | 'info' | 'warning' | 'error'

export type HttpRequestLog = {
    direction: 'incoming' | 'outgoing'
    method: string
    url: string
    statusCode: number
    latencyMs: number
    endpoint: string
    success: boolean
}

const logging = new Logging({ projectId: process.env.GOOGLE_PROJECT_ID })
const log_name = 'tavla_admin'
const log = logging.log(log_name)
const requests_log = logging.log('tavla_requests')

function sanitizeForLog(value: unknown): string {
    return (
        String(value)
            .replace(/[\r\n\u2028\u2029]+/g, ' ')
            // biome-ignore lint/suspicious/noControlCharactersInRegex: GitHub-advanced-security fix for log injection
            .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
            .trim()
    )
}

export async function logToGcp(level: LogLevel, message: string) {
    const safeLevel = sanitizeForLog(level) as LogLevel
    const safeMessage = sanitizeForLog(message)

    try {
        const metadata = {
            resource: { type: 'global' },
            severity: safeLevel.toUpperCase(),
        }
        const entry = log.entry(metadata, { message: safeMessage })
        await log.write(entry)
    } catch {
        // silently ignore — expected to fail locally without GCP credentials
    }
}

function sanitizeUrl(url: string): string {
    try {
        const parsed = new URL(url)
        return `${parsed.origin}${parsed.pathname}`
    } catch {
        return sanitizeForLog(url)
    }
}

export async function logHttpRequest(payload: HttpRequestLog) {
    const safeUrl = sanitizeUrl(payload.url)
    const safeEndpoint = sanitizeForLog(payload.endpoint)
    const safeMethod = sanitizeForLog(payload.method)

    try {
        const latencySeconds = Math.floor(payload.latencyMs / 1000)
        const latencyNanos = (payload.latencyMs % 1000) * 1_000_000
        const metadata = {
            resource: { type: 'global' },
            severity: payload.success ? 'INFO' : 'WARNING',
            labels: {
                direction: payload.direction,
                endpoint: safeEndpoint,
                method: safeMethod,
                status_code: String(payload.statusCode),
            },
            httpRequest: {
                requestMethod: safeMethod,
                requestUrl: safeUrl,
                status: payload.statusCode,
                latency: { seconds: latencySeconds, nanos: latencyNanos },
            },
        }
        const entry = requests_log.entry(metadata, {
            message: `${payload.direction} ${safeMethod} ${safeEndpoint} ${payload.statusCode} ${payload.latencyMs}ms`,
            direction: payload.direction,
            endpoint: safeEndpoint,
            statusCode: payload.statusCode,
            latencyMs: payload.latencyMs,
            success: payload.success,
        })
        await requests_log.write(entry)
    } catch {
        // silently ignore — expected to fail locally without GCP credentials
    }
}
