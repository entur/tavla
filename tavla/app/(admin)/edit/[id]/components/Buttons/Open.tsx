'use client'
import { Button, IconButton } from '@entur/button'
import { ExternalIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { useLink } from 'hooks/useLink'
import Link from 'next/link'
import React from 'react'

function Open({ type, bid }: { type?: 'button' | 'icon'; bid?: string }) {
    const link = useLink(bid)
    if (type === 'button') {
        return (
            <Button
                variant="primary"
                as={Link}
                aria-label="Åpne tavle"
                href={link ?? '/'}
                target="_blank"
            >
                Åpne tavle
                <ExternalIcon className="!top-[-2px]" />
            </Button>
        )
    }

    return (
        <Tooltip content="Åpne tavle" placement="bottom">
            <IconButton
                as={Link}
                aria-label="Åpne tavle"
                href={link ?? '/'}
                target="_blank"
            >
                <ExternalIcon />
            </IconButton>
        </Tooltip>
    )
}

export { Open }
