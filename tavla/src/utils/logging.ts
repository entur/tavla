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

    if (process.env.NODE_ENV === 'development') {
        // biome-ignore lint/suspicious/noConsole: local dev output
        console.log({
            severity: safeLevel.toUpperCase(),
            timestamp: new Date().toISOString(),
            message: safeMessage,
        })
        return
    }

    const log = getLog()
    if (!log) return

    const entry = log.entry(
        { resource: { type: 'global' }, severity: safeLevel.toUpperCase() },
        { message: safeMessage },
    )
    // biome-ignore lint/suspicious/noConsole: surface GCP logging errors
    log.write(entry).catch((error) =>
        console.error('GCP logging failed:', error),
    )
}
