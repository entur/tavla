'use client'
import { Button } from '@entur/button'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import Link from 'next/link'

function CreateUserButton({
    variant,
    width,
    claimBoard,
    children,
}: {
    variant?: 'primary' | 'secondary'
    width?: 'auto' | 'fluid'
    claimBoard?: string
    children?: React.ReactNode
}) {
    const { capture } = usePosthogTracking()
    const href = claimBoard
        ? `?login=create&claimBoard=${claimBoard}`
        : '?login=create'
    return (
        <Button
            variant={variant || 'primary'}
            size="medium"
            as={Link}
            href={href}
            onClick={() => {
                capture('user_create_started', {
                    location: 'board_without_user',
                })
            }}
            width={width || 'auto'}
        >
            {children || 'Opprett bruker'}
        </Button>
    )
}

export { CreateUserButton }
