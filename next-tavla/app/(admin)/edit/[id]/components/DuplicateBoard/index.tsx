'use client'
import { Button } from '@entur/button'
import { AddIcon } from '@entur/icons'
import { OverflowMenuItem } from '@entur/menu'
import { create } from 'app/(admin)/components/CreateBoard/actions'
import { TBoard, TOrganizationID } from 'types/settings'

function DuplicateBoard({
    board,
    oid,
    type,
}: {
    board: TBoard
    oid?: TOrganizationID
    type?: 'button' | 'action'
}) {
    const handleSelect = async () => {
        await create(
            {
                ...board,
                meta: {
                    ...board.meta,
                    title: board.meta.title + ' - duplikat',
                },
            },
            oid,
        )
    }
    if (type === 'button')
        return (
            <Button
                variant="secondary"
                aria-label="Slett tavle"
                onClick={handleSelect}
            >
                Dupliser Tavle
                <AddIcon />
            </Button>
        )
    return (
        <OverflowMenuItem onSelect={handleSelect}>
            <div className="flex flex-row">
                <AddIcon inline />
                Dupliser tavle
            </div>
        </OverflowMenuItem>
    )
}

export { DuplicateBoard }
