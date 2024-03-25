'use client'
import { useToast } from '@entur/alert'
import { Button, IconButton } from '@entur/button'
import { CopyIcon, ExternalIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { useLink } from 'hooks/useLink'
import Link from 'next/link'
import React from 'react'

function CopyButton({ type, bid }: { type?: 'button' | 'icon'; bid?: string }) {
    const { addToast } = useToast()
    const link = useLink(bid)
    const copy = () => {
        navigator.clipboard.writeText(link ?? '')
        addToast('Lenke til Tavla kopiert')
    }

    if (type === 'button') {
        return (
            <Button
                variant="secondary"
                aria-label="Kopier tavle"
                onClick={copy}
            >
                Kopier Tavle
                <CopyIcon />
            </Button>
        )
    }
    return (
        <Tooltip content="Kopier lenke" placement="bottom">
            <IconButton aria-label="Kopier tavle" onClick={copy}>
                <CopyIcon />
            </IconButton>
        </Tooltip>
    )
}

function OpenButton({ type, bid }: { type?: 'button' | 'icon'; bid?: string }) {
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
                Åpne Tavle
                <ExternalIcon />
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

export { OpenButton, CopyButton }
