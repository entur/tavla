'use client'
import { Button } from '@entur/button'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import Link from 'next/link'

function CreateUserButton({
    variant,
    width,
}: {
    variant?: 'primary' | 'secondary'
    width?: 'auto' | 'fluid'
}) {
    const posthog = usePosthogTracking()
    return (
        <Button
            variant={variant || 'primary'}
            size="medium"
            as={Link}
            href="?login=create"
            onClick={() => {
                posthog.capture('user_create_started', {
                    location: 'demo_page',
                })
            }}
            width={width || 'auto'}
        >
            Opprett bruker
        </Button>
    )
}

export { CreateUserButton }
