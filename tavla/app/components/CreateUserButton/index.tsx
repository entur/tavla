'use client'
import { Button } from '@entur/button'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'

interface CreateUserButtonProps {
    trackingEvent: string
}

function CreateUserButton({ trackingEvent }: CreateUserButtonProps) {
    const posthog = usePostHog()
    return (
        <Button
            variant="primary"
            size="medium"
            as={Link}
            href="?login=create"
            onClick={() => {
                posthog.capture(trackingEvent)
            }}
        >
            Opprett bruker
        </Button>
    )
}

export { CreateUserButton }
