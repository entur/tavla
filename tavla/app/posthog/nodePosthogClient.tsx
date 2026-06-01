import { cookies } from 'next/headers'
import { PostHog } from 'posthog-node'

function nodePosthogClient() {
    const posthogClient = new PostHog(
        process.env.NEXT_PUBLIC_POSTHOG_TOKEN ?? '',
        {
            host: 'https://eu.i.posthog.com',
            flushAt: 1,
            flushInterval: 0,
        },
    )
    return posthogClient
}

export async function isFeatureEnabled(flag: string): Promise<boolean> {
    const posthogClient = nodePosthogClient()

    const cookieStore = await cookies()
    const cookieKey = `ph_${process.env.NEXT_PUBLIC_POSTHOG_TOKEN}_posthog`
    const phCookie = cookieStore.get(cookieKey)

    console.log('[isFeatureEnabled] flag:', flag)
    console.log('[isFeatureEnabled] cookie found:', !!phCookie)

    if (!phCookie) return false

    try {
        const phData = JSON.parse(phCookie.value) as { distinct_id?: string }
        const distinctId = phData.distinct_id
        console.log('[isFeatureEnabled] distinctId:', distinctId)
        if (!distinctId) return false

        const enabled = await posthogClient.isFeatureEnabled(flag, distinctId)
        console.log('[isFeatureEnabled] result:', enabled)
        return enabled ?? false
    } catch (error) {
        console.log('[isFeatureEnabled] error:', error)
        return false
    }
}
