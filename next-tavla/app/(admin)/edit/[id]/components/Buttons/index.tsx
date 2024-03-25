'use client'
import { useToast } from '@entur/alert'
import { Button, IconButton } from '@entur/button'
import { CopyIcon, ExternalIcon } from '@entur/icons'
import { Delete } from 'app/(admin)/boards/components/Column/Delete'
import { useLink } from 'hooks/useLink'
import Link from 'next/link'
import React from 'react'
import { TBoard } from 'types/settings'

function Buttons({ board }: { board: TBoard }) {
    const link = useLink(board.id)
    return (
        <div className="flexRow g-2 w-100 alignCenter">
            <OpenButton link={link} type="button" />

            <CopyButton link={link} type="button" />

            <Delete board={board} type="button" />
        </div>
    )
}

function CopyButton({
    type,
    link,
}: {
    type?: 'button' | 'icon'
    link?: string
}) {
    const { addToast } = useToast()

    const copy = () => {
        navigator.clipboard.writeText(link ?? '')
        addToast('Lenke til Tavla kopiert')
    }
    return type === 'button' ? (
        <Button variant="secondary" aria-label="Kopier tavle" onClick={copy}>
            Kopier Tavle
            <CopyIcon />
        </Button>
    ) : (
        <IconButton aria-label="Kopier tavle" onClick={copy}>
            <CopyIcon />
        </IconButton>
    )
}

function OpenButton({
    type,
    link,
}: {
    type?: 'button' | 'icon'
    link?: string
}) {
    return type === 'button' ? (
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
    ) : (
        <IconButton
            as={Link}
            aria-label="Åpne tavle"
            href={link ?? '/'}
            target="_blank"
        >
            <ExternalIcon />
        </IconButton>
    )
}

export { Buttons, OpenButton, CopyButton }
