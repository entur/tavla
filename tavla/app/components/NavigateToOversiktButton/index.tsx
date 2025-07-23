'use client'
import { Button } from '@entur/button'
import { ForwardIcon } from '@entur/icons'
import Link from 'next/link'

export function NavigateToOversiktButton() {
    return (
        <Button variant="primary" size="medium" as={Link} href="/oversikt">
            Gå til mine tavler
            <ForwardIcon />
        </Button>
    )
}
