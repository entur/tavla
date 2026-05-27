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

type LogType = 'server-action' | 'http' | 'graphql'

type LogExtra = {
    bid?: string
    folderId?: string
    status?: number
    type?: LogType
    path?: string
}

type LogPayload = {
    message: string
    type?: LogType
    action?: string
    method?: string
    endpoint?: string
    status?: number
    bid?: string
    folderId?: string
    path?: string
}

function buildPayload(message: string, extra?: LogExtra): LogPayload {
    const actionMatch = message.match(/^action:(\w+)/)
    if (actionMatch) {
        return {
            message,
            type: 'server-action',
            action: actionMatch[1],
            ...extra,
        }
    }

    const httpMatch = message.match(/^(GET|POST|PUT|DELETE|PATCH) /)
    if (httpMatch) {
        const status = message.match(/status=(\d+)/)?.[1]
        return {
            message,
            type: 'http',
            method: httpMatch[1],
            ...(status ? { status: Number(status) } : {}),
            ...extra,
        }
    }

    const graphqlMatch = message.match(/^GraphQL ([\w-]+)/)
    if (graphqlMatch) {
        const status = message.match(/status=(\d+)/)?.[1]
        return {
            message,
            type: 'graphql',
            endpoint: graphqlMatch[1],
            ...(status ? { status: Number(status) } : {}),
            ...extra,
        }
    }

    return { message, ...extra }
}

function sanitizeForLog(value: unknown): string {
    return (
        String(value)
            .replace(/[\r\n\u2028\u2029]+/g, ' ')
            // biome-ignore lint/suspicious/noControlCharactersInRegex: GitHub-advanced-security fix for log injection
            .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
            .trim()
    )
}

export async function logToGcp(
    level: LogLevel,
    message: string,
    extra?: LogExtra,
) {
    const safeLevel = sanitizeForLog(level) as LogLevel
    const safeMessage = sanitizeForLog(message)

    const safeExtra: LogExtra | undefined = extra
        ? {
              bid: sanitizeForLog(extra?.bid),
              folderId: sanitizeForLog(extra?.folderId),
              status: extra?.status,
              path: sanitizeForLog(extra?.path),
          }
        : undefined

    if (process.env.NODE_ENV === 'development') {
        // biome-ignore lint/suspicious/noConsole: local dev output
        console.log({
            severity: safeLevel.toUpperCase(),
            timestamp: new Date().toISOString(),
            ...buildPayload(safeMessage, safeExtra),
        })
        return
    }

    const log = getLog()
    if (!log) return

    const entry = log.entry(
        { resource: { type: 'global' }, severity: safeLevel.toUpperCase() },
        buildPayload(safeMessage, extra),
    )
    await log.write(entry).catch((error) => {
        // biome-ignore lint/suspicious/noConsole: Log errors on GCP logging in container output.
        console.error('GCP logging failed:', error)
    })
}
