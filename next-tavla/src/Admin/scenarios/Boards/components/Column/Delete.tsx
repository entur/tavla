import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { TBoard } from 'types/settings'
import { useToggle } from 'hooks/useToggle'
import { DeleteModal } from 'Admin/components/DeleteModal'
import { Tooltip } from '@entur/tooltip'
import { useOptimisticDeleteBoard } from '../../utils/context'

function Delete({ board }: { board: TBoard }) {
    const deleteDispatch = useOptimisticDeleteBoard()
    const [showModal, openModal, closeModal] = useToggle()

    const deleteBoardHandler = async () => {
        await deleteDispatch(board)
        closeModal()
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
