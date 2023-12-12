import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { TBoard } from 'types/settings'
import { DeleteModal } from 'Admin/components/DeleteModal'
import { Tooltip } from '@entur/tooltip'
import { useParamsSetter } from 'app/(admin)/boards/hooks/useParamsSetter'
import { usePageParam } from 'app/(admin)/hooks/usePageParam'

function Delete({ board }: { board: TBoard }) {
    const { setQuery, deleteQuery } = useParamsSetter()
    const { hasPage, pageParam } = usePageParam('delete')

    return (
        <>
            <Tooltip content="Slett tavle" placement="bottom">
                <IconButton
                    aria-label="Slett tavle"
                    onClick={() => setQuery('delete', board.id || '')}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <DeleteModal
                board={board}
                isOpen={hasPage && board.id === pageParam}
                closeModal={() => deleteQuery('delete')}
            />
        </>
    )
}

export { Delete }
