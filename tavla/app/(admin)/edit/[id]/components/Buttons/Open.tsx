'use client'
import { Button, IconButton } from '@entur/button'
import { ExternalIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'

import { useLink } from 'hooks/useLink'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import React from 'react'

function Open({ type, bid }: { type?: 'button' | 'icon'; bid?: string }) {
    const link = useLink(bid)
    const posthog = usePostHog()
    if (type === 'button') {
        return (
            <Button
                variant="primary"
                as={Link}
                aria-label="Åpne tavle"
                href={link ?? '/'}
                target="_blank"
                onClick={() => posthog.capture('OPEN_BOARD_BTN')}
            >
                Åpne tavle
                <ExternalIcon className="!top-[-2px]" />
            </Button>
        )
    }

    return (
        <Tooltip
            content="Åpne tavle"
            placement="bottom"
            id="tooltip-open-board"
        >
            <IconButton
                as={Link}
                aria-label="Åpne tavle"
                href={link ?? '/'}
                target="_blank"
                onClick={() => posthog.capture('OPEN_BOARD_BTN')}
            >
                <ExternalIcon />
            </IconButton>
        </Tooltip>
    )
}

export { Open }
