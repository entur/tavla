'use server'
import { Logging } from '@google-cloud/logging'

export type LogLevel = 'debug' | 'info' | 'warning' | 'error'

const logging = new Logging({ projectId: process.env.GOOGLE_PROJECT_ID })
const log_name = 'tavla_admin'
const log = logging.log(log_name)

function sanitizeForLog(value: string): string {
    return (
        String(value)
            .replace(/[\r\n]+/g, ' ')
            // biome-ignore lint/suspicious/noControlCharactersInRegex: GitHub-advanced-security fix for log injection
            .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
    )
}

export async function logToGcp(level: LogLevel, message: string) {
    const safeLevel = sanitizeForLog(level) as LogLevel
    const safeMessage = sanitizeForLog(message)

    if (process.env.NODE_ENV === 'development') {
        // biome-ignore lint/suspicious/noConsole: If using development environment (local), skip logging to GCP and print out to console.
        console.log(
            `GCP log, level ${safeLevel} @ ${new Date().toISOString()}: ${safeMessage}`,
        )

        return
    }

    try {
        const metadata = {
            resource: { type: 'global' },
            severity: safeLevel.toUpperCase(),
        }
        const entry = log.entry(metadata, { message: safeMessage })
        await log.write(entry)
    } catch (error) {
        // biome-ignore lint/suspicious/noConsole: surface GCP logging errors
        console.error('GCP logging failed:', error)
    }
}
