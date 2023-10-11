import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph } from '@entur/typography'
import { TBoard } from 'types/settings'
import classes from './styles.module.css'

function DeleteModal({
    board,
    isOpen,
    closeModal,
    onDelete,
}: {
    board: TBoard
    isOpen: boolean
    closeModal: () => void
    onDelete: () => void
}) {
    return (
        <>
            <Modal
                open={isOpen}
                size="small"
                onDismiss={closeModal}
                closeLabel="Avbryt sletting"
                className={classes.deleteModal}
            >
                <Heading1>Slett tavle</Heading1>
                <LeadParagraph>
                    {board?.meta?.title
                        ? `Er du sikker på at du vil slette tavlen "${board.meta.title}"?`
                        : 'Er du sikker på at du vil slette denne tavlen?'}
                </LeadParagraph>
                <div className={classes.actions}>
                    <SecondaryButton
                        onClick={closeModal}
                        aria-label="Avbryt sletting"
                    >
                        Avbryt
                    </SecondaryButton>
                    <PrimaryButton aria-label="Slett tavle" onClick={onDelete}>
                        Ja, slett!
                    </PrimaryButton>
                </div>
            </Modal>
        </>
    )
}

export { DeleteModal }
