import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { TBoard } from 'types/settings'
import { Tooltip } from '@entur/tooltip'
import { useModalWithValue } from '../../hooks/useModalWithValue'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph } from '@entur/typography'
import { HiddenInput } from 'components/Form/HiddenInput'
import { FormError } from 'app/(admin)/components/FormError'
import { useFormState } from 'react-dom'
import { deleteBoardAction } from '../../utils/formActions'
import { getFormFeedbackForField } from 'app/(admin)/utils'

function Delete({ board }: { board: TBoard }) {
    const [state, action] = useFormState(deleteBoardAction, undefined)
    const { isOpen, open, close } = useModalWithValue('delete', board.id ?? '')

    return (
        <>
            <Tooltip content="Slett tavle" placement="bottom">
                <IconButton aria-label="Slett tavle" onClick={open}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Modal
                open={isOpen}
                size="small"
                onDismiss={close}
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
                        onClick={close}
                        aria-label="Avbryt sletting"
                    >
                        Avbryt
                    </SecondaryButton>
                    <form action={action} onSubmit={close}>
                        <HiddenInput id="bid" value={board.id} />
                        <FormError
                            {...getFormFeedbackForField('general', state)}
                        />
                        <PrimaryButton type="submit" aria-label="Slett tavle">
                            Ja, slett!
                        </PrimaryButton>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export { Delete }
