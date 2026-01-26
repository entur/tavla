'use client'
import { Button } from '@entur/button'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/useTracking'
import Link from 'next/link'

interface CreateUserButtonProps {
    trackingLocation: EventProps<'user_create_started'>['location']
}

function CreateUserButton({ trackingLocation }: CreateUserButtonProps) {
    const posthog = usePosthogTracking()
    return (
        <Button
            variant="primary"
            size="medium"
            as={Link}
            href="?login=create"
            onClick={() => {
                posthog.capture('user_create_started', {
                    location: trackingLocation,
                })
            }}
        >
            Opprett bruker
        </Button>
    )
}

export { CreateUserButton }
