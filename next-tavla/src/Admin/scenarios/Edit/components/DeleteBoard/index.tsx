import { useToggle } from 'hooks/useToggle'
import { PrimaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { DeleteModal } from 'Admin/components/DeleteModal'
import { TBoard } from 'types/settings'

function DeleteBoard({ board }: { board: TBoard }) {
    const [showModal, openModal, closeModal] = useToggle()

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
            />
        </>
    )
}

export { DeleteBoard }
