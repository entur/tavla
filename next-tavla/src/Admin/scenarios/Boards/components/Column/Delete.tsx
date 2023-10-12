import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { useToast } from '@entur/alert'
import { TBoard } from 'types/settings'
import { useBoardsSettingsDispatch } from '../../utils/context'
import { useToggle } from 'hooks/useToggle'
import { deleteBoard } from '../../utils/delete'
import { TavlaError } from 'Admin/types/error'
import { DeleteModal } from 'Admin/components/DeleteModal'
import { Tooltip } from '@entur/tooltip'

function DeleteBoardButton({ board }: { board: TBoard }) {
    const dispatch = useBoardsSettingsDispatch()
    const [showModal, openModal, closeModal] = useToggle()

    const { addToast } = useToast()

    const deleteBoardHandler = async () => {
        closeModal()
        try {
            if (!board.id)
                throw new TavlaError({
                    code: 'NOT_FOUND',
                    message: 'Board not found',
                })

            await deleteBoard(board.id)
            dispatch({ type: 'deleteBoard', bid: board.id })
            addToast({
                title: 'Tavle slettet!',
                content: `${board?.meta?.title ?? 'Tavla'} er slettet!`,
                variant: 'info',
            })
        } catch (error) {
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

export { DeleteBoardButton }
