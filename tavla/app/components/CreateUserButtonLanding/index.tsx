'use client'
import { Button } from '@entur/button'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'

function CreateUserButtonLanding() {
    const posthog = usePostHog()
    return (
        <Button
            variant="primary"
            size="medium"
            as={Link}
            href="?login=create"
            onClick={() => {
                posthog.capture('CREATE_USER_BTN_FROM_LANDING')
            }}
        >
            Opprett bruker
        </Button>
    )
}
export { CreateUserButtonLanding }
