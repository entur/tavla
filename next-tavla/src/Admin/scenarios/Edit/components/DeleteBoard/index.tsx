import { useToggle } from 'hooks/useToggle'
import { PrimaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { useRouter } from 'next/router'
import { DeleteModal } from 'Admin/components/DeleteModal'
import { TBoard } from 'types/settings'
import { useOptimisticDeleteBoard } from 'Admin/scenarios/Boards/utils/context'

function DeleteBoard({ board }: { board: TBoard }) {
    const deleteDispatch = useOptimisticDeleteBoard()

    const [showModal, openModal, closeModal] = useToggle()
    const router = useRouter()

    const removeBoard = async () => {
        await deleteDispatch(board)
        router.push('/edit/boards')
    }

    return (
        <>
            <PrimaryButton onClick={openModal}>
                Slett tavle
                <DeleteIcon />
            </PrimaryButton>
            <DeleteModal
                board={board}
                isOpen={showModal}
                closeModal={closeModal}
                deleteHandler={removeBoard}
            />
        </>
    )
}

export { DeleteBoard }
