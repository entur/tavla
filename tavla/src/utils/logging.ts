'use server'
import { Logging } from '@google-cloud/logging'

export type LogLevel = 'debug' | 'info' | 'warning' | 'error'

let _log: ReturnType<InstanceType<typeof Logging>['log']> | null = null

function getLog() {
    if (_log) return _log
    const projectId = process.env.GOOGLE_PROJECT_ID
    if (!projectId) return null
    _log = new Logging({ projectId }).log('tavla_admin')
    return _log
}

export type LogType =
    | 'server-action'
    | 'http'
    | 'graphql'
    | 'firestore'
    | 'tavla-visning'

export type LogFields = {
    type?: LogType
    action?: string
    method?: string
    endpoint?: string
    status?: number
    bid?: string
    folderId?: string
    path?: string
    errorCode?: string
    errorName?: string
    errorMessage?: string
    userAgent?: string
    context?: Record<string, string | number | boolean>
}

const STRING_FIELDS = [
    'type',
    'action',
    'method',
    'endpoint',
    'bid',
    'folderId',
    'path',
    'errorCode',
    'errorName',
    'errorMessage',
    'userAgent',
] as const satisfies readonly (keyof LogFields)[]

function sanitizeForLog(value: unknown): string | undefined {
    if (value === undefined || value === null) return undefined
    return (
        String(value)
            .replace(/[\r\n\u2028\u2029]+/g, ' ')
            // biome-ignore lint/suspicious/noControlCharactersInRegex: GitHub-advanced-security fix for log injection
            .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
            .trim()
    )
}

function sanitizeFields(fields?: LogFields): Record<string, unknown> {
    if (!fields) return {}

    const sanitized: Record<string, unknown> = {}

    for (const key of STRING_FIELDS) {
        const value = fields[key]
        if (value !== undefined) sanitized[key] = sanitizeForLog(value)
    }

    if (fields.status !== undefined) sanitized.status = fields.status

    if (fields.context) {
        sanitized.context = Object.fromEntries(
            Object.entries(fields.context).map(([key, value]) => [
                key,
                typeof value === 'string' ? sanitizeForLog(value) : value,
            ]),
        )
    }

    return sanitized
}

export async function logToGcp(
    level: LogLevel,
    message: string,
    fields?: LogFields,
) {
    const safeLevel = sanitizeForLog(level) as LogLevel
    const payload = {
        message: sanitizeForLog(message),
        ...sanitizeFields(fields),
    }

    if (process.env.NODE_ENV === 'development') {
        // biome-ignore lint/suspicious/noConsole: local dev output
        console.log({
            severity: safeLevel.toUpperCase(),
            timestamp: new Date().toISOString(),
            ...payload,
        })
        return
    }

    const log = getLog()
    if (!log) return

    const entry = log.entry(
        { resource: { type: 'global' }, severity: safeLevel.toUpperCase() },
        payload,
    )
    await log.write(entry).catch((error) => {
        // biome-ignore lint/suspicious/noConsole: Log errors on GCP logging in container output.
        console.error('GCP logging failed:', error)
    })
}
