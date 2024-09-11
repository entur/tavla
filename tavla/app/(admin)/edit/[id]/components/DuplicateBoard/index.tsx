'use client'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'
import { AddIcon } from '@entur/icons'
import { OverflowMenuItem } from '@entur/menu'
import { TBoard, TOrganizationID } from 'types/settings'
import { duplicateBoard } from './actions'

function DuplicateBoard({
    board,
    oid,
    type,
}: {
    board: TBoard
    oid?: TOrganizationID
    type?: 'button' | 'action'
}) {
    const { addToast } = useToast()
    const handleSelect = async () => {
        delete board.id
        await duplicateBoard(
            {
                ...board,
                meta: {
                    ...board.meta,
                    title: board.meta.title + ' - duplikat',
                },
            },
            oid,
        )
        addToast('Tavle duplisert!')
    }
    if (type === 'button')
        return (
            <Button
                variant="secondary"
                aria-label="Dupliser tavle"
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
