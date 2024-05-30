'use client'
import { EmailIcon } from '@entur/icons'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'

function FloatingContact() {
    const posthog = usePostHog()
    return (
        <div className="fixed bottom-12 right-12">
            <Link
                onClick={() =>
                    posthog.capture('SUPPORT_EMAIL', { type: 'floating' })
                }
                href="mailto:tavla@entur.no"
                target="_blank"
                className="flex items-center justify-center w-14 h-14 rounded-full border-primary border-2 bg-primary hover:bg-secondary"
            >
                <EmailIcon size={20} />
            </Link>
        </div>
    )
}
export { FloatingContact }
