'use server'
import { logger } from 'utils/logger'

const log = logger.child({ module: 'appErrorHandler' })
export async function logServerError(error: {
    message: string
    stack?: string
    name?: string
    cause?: unknown
    digest?: string
}) {
    log.error({
        message: error.message,
        stacktrace: error.stack,
        name: error.name,
        cause: error.cause,
        digest: error.digest,
    })
    return { success: true }
}
