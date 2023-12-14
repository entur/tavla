import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph } from '@entur/typography'
import { TBoard } from 'types/settings'

function DeleteModal({
    board,
    isOpen,
    closeModal,
    deleteHandler,
}: {
    board: TBoard
    isOpen: boolean
    closeModal: () => void
    deleteHandler: () => void
}) {
    return (
        <Modal
            open={isOpen}
            size="small"
            onDismiss={closeModal}
            closeLabel="Avbryt sletting"
            className="flexColumn justifyStart alignCenter textCenter"
        >
            <Heading1 className="text-rem-4">Slett tavle</Heading1>
            <LeadParagraph>
                {board?.meta?.title
                    ? `Er du sikker på at du vil slette tavlen "${board.meta.title}"?`
                    : 'Er du sikker på at du vil slette denne tavlen?'}
            </LeadParagraph>
            <div className="flexRow justifyAround alignCenter g-2">
                <SecondaryButton
                    onClick={closeModal}
                    aria-label="Avbryt sletting"
                >
                    Avbryt
                </SecondaryButton>
                <PrimaryButton aria-label="Slett tavle" onClick={deleteHandler}>
                    Ja, slett!
                </PrimaryButton>
            </div>
        </Modal>
    )
}

export { DeleteModal }
