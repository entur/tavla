'use client'
import { Button } from '@entur/button'
import Link from 'next/link'
import { ForwardIcon } from '@entur/icons'

export function NavigateToOversiktButton() {
    return (
        <Button variant="primary" size="medium" as={Link} href="/oversikt">
            Gå til mine tavler
            <ForwardIcon />
        </Button>
    )
}
