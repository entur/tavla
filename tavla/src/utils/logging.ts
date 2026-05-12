'use server'
import { Logging } from '@google-cloud/logging'

export type LogLevel = 'debug' | 'info' | 'warning' | 'error'

const logging = new Logging({ projectId: process.env.GCLOUD_PROJECT })
const log_name = 'tavla_admin'
const log = logging.log(log_name)

export async function logToGcp(level: LogLevel, message: string) {
    if (process.env.NODE_ENV === 'development') {
        // biome-ignore lint/suspicious/noConsole: If using development environment (local), skip logging to GCP and print out to console.
        console.log(
            `------------------------------------\nGCP log event: \n > [${level}] ${message}\n------------------------------------`,
        )

        return
    }

    try {
        const metadata = {
            resource: { type: 'global' },
            severity: level.toUpperCase(),
        }
        const entry = log.entry(metadata, { message })
        await log.write(entry)
    } catch (error) {
        // biome-ignore lint/suspicious/noConsole: surface GCP logging errors
        console.error('GCP logging failed:', error)
    }
}
