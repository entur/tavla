import {
    onSchedule,
    type ScheduledEvent,
    type ScheduleOptions,
} from 'firebase-functions/v2/scheduler'
import { secretParams } from './config/secretParams'

const getDefaultOptions = () => {
    return {
        region: 'europe-west1' as const,
        secrets: secretParams.map((secret) => secret.name),
        serviceAccount: `tavla-functions@${process.env.GCLOUD_PROJECT}.iam.gserviceaccount.com`,
        timeZone: 'Europe/Oslo' as const,
    }
}

export const scheduledFunction = (
    schedule: string,
    options: ScheduleOptions | undefined,
    handler: (event: ScheduledEvent) => Promise<void>,
) => {
    return onSchedule(
        {
            schedule,
            ...options,
            ...getDefaultOptions(),
        },
        async (event) => {
            await handler(event)
        },
    )
}
