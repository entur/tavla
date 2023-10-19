import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { TBoard } from 'types/settings'
import { useToggle } from 'hooks/useToggle'
import { DeleteModal } from 'Admin/components/DeleteModal'
import { Tooltip } from '@entur/tooltip'
import { useBoardsSettingsDispatch } from '../../utils/context'
import { TavlaError } from 'Admin/types/error'
import { useToast } from '@entur/alert'

function Delete({ board }: { board: TBoard }) {
    const dispatch = useBoardsSettingsDispatch()
    const { addToast } = useToast()
    const [showModal, openModal, closeModal] = useToggle()

    const deleteBoardHandler = async () => {
        try {
            if (!board.id)
                throw new TavlaError({
                    code: 'NOT_FOUND',
                    message: 'Board ID is undefined',
                })

            const deleteReq = await fetch('api/board', {
                body: JSON.stringify({ bid: board.id }),
                method: 'DELETE',
            })

            closeModal()

            if (deleteReq.status !== 200)
                throw new TavlaError({
                    code: 'BOARD',
                    message: 'Could not delete board!',
                })

            dispatch({ type: 'deleteBoard', bid: board.id })
            addToast({
                title: 'Tavle slettet!',
                content: `${board?.meta?.title ?? 'Tavla'} er slettet!`,
                variant: 'info',
            })
        } catch (e) {
            addToast({
                title: 'Noe gikk galt',
                content: 'Kunne ikke slette tavle',
                variant: 'info',
            })
        }
    }

    return (
        <>
            <Tooltip content="Slett tavle" placement="bottom">
                <IconButton aria-label="Slett tavle" onClick={openModal}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <DeleteModal
                board={board}
                isOpen={showModal}
                closeModal={closeModal}
                deleteHandler={deleteBoardHandler}
            />
        </>
    )
}

export { Delete }
