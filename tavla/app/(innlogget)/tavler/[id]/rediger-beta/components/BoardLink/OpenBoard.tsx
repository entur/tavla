'use client'
import { Button } from '@entur/button'
import { ExternalIcon } from '@entur/icons'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import Link from 'next/link'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'

function OpenBoard({ board }: { board: BoardDB }) {
    const { capture } = usePosthogTracking()

    const link = getBoardLinkClient(board.customUrl ?? board.id)

    const ariaLabel = board.meta?.title
        ? `Åpne tavle ${board.meta.title}`
        : 'Åpne tavle'

    return (
        <Button
            variant="primary"
            as={Link}
            aria-label={ariaLabel}
            href={link}
            rel="noopener noreferrer"
            target="_blank"
            className="w-full sm:w-auto"
            onClick={() => {
                capture('board_opened', {
                    location: 'edit_board_page',
                })
            }}
        >
            Åpne tavle
            <ExternalIcon className="!top-[-2px]" />
        </Button>
    )
}

export { OpenBoard }
