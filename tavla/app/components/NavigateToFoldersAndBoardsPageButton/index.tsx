'use client'
import { Button } from '@entur/button'
import Link from 'next/link'
import { ForwardIcon } from '@entur/icons'

export function NavigateToFoldersAndBoardsPageButton() {
    return (
        <Button
            variant="primary"
            size="medium"
            as={Link}
            href="oversikt"
            onClick={() => {}}
        >
            Naviger til mapper og tavler
            <ForwardIcon />
        </Button>
    )
}
