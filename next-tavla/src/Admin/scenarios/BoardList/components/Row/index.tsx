import { IconButton } from '@entur/button'
import { CopyIcon, EditIcon } from '@entur/icons'
import { TBoard } from 'types/settings'
import { useToast } from '@entur/alert'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Cell } from 'Admin/scenarios/BoardList/components/Cell'
import { Tooltip } from '@entur/tooltip'
import { Info } from 'Admin/scenarios/Info'
import { BoardTransportModes } from '../BoardTransportModes'
import { TOptionalColumn } from 'types/optionalColumns'

function Row({
    board,
    shownOptionalColumns,
}: {
    board: TBoard
    shownOptionalColumns: TOptionalColumn[]
}) {
    const { addToast } = useToast()
    const router = useRouter()
    const [link, setLink] = useState('')

    useEffect(() => {
        setLink(window.location.origin + '/' + board.id)
    }, [board.id])

    async function editBoard() {
        await router.push('/edit/' + board.id)
    }

    return (
        <>
            <Cell>{board.title ?? 'Tavla'}</Cell>
            <Cell>
                {link}
                <Tooltip content="Kopier lenke" placement="bottom">
                    <IconButton
                        aria-label="Kopier lenke"
                        onClick={() => {
                            navigator.clipboard.writeText(link)
                            addToast('Lenke til Tavla kopiert')
                        }}
                    >
                        <CopyIcon />
                    </IconButton>
                </Tooltip>
            </Cell>
            {shownOptionalColumns.find(
                (col) => col.name === 'transportModes',
            ) && (
                <Cell>
                    <BoardTransportModes board={board} />
                </Cell>
            )}
            <Cell centered>
                <Info board={board} />
                <Tooltip content="Rediger tavle" placement="bottom">
                    <IconButton aria-label="Rediger tavle" onClick={editBoard}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Cell>
        </>
    )
}

export { Row }
