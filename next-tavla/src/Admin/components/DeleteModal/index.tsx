import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph } from '@entur/typography'
import { deleteBoardAction } from 'app/(admin)/boards/utils/formActions'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useFormState } from 'react-dom'
import { TBoard } from 'types/settings'

function DeleteModal({
    board,
    isOpen,
    closeModal,
}: {
    board: TBoard
    isOpen: boolean
    closeModal: () => void
}) {
    const [state, action] = useFormState(deleteBoardAction, undefined)
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
                <form action={action} onSubmit={closeModal}>
                    <HiddenInput id="bid" value={board.id} />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <PrimaryButton type="submit" aria-label="Slett tavle">
                        Ja, slett!
                    </PrimaryButton>
                </form>
            </div>
        </Modal>
    )
}

export { DeleteModal }
