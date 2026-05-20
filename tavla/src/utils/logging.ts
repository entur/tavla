'use server'

export type LogLevel = 'debug' | 'info' | 'warning' | 'error'

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

    // Fluentbit reads stdout from the pod and forwards structured JSON to Cloud Logging
    // biome-ignore lint/suspicious/noConsole: structured logging for GCP log ingestion
    console.log(
        JSON.stringify({
            severity: safeLevel.toUpperCase(),
            message: safeMessage,
        }),
    )
}
