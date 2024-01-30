import { IconButton, PrimaryButton, SecondarySquareButton } from '@entur/button'
import { CloseIcon, DeleteIcon } from '@entur/icons'
import { TBoard } from 'types/settings'
import { Tooltip } from '@entur/tooltip'
import { useModalWithValue } from '../../hooks/useModalWithValue'
import { Modal } from '@entur/modal'
import { Heading2, Paragraph } from '@entur/typography'
import { HiddenInput } from 'components/Form/HiddenInput'
import { FormError } from 'app/(admin)/components/FormError'
import { useFormState } from 'react-dom'
import { deleteBoardAction } from '../../utils/formActions'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import sheep from 'assets/illustrations/Sheep.png'
import Image from 'next/image'
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
                <SecondarySquareButton
                    aria-label="Avbryt sletting"
                    className="ml-auto"
                    onClick={close}
                >
                    <CloseIcon />
                </SecondarySquareButton>
                <Image src={sheep} alt="" className="h-50 w-50" />
                <Heading2>Slett tavle</Heading2>
                <Paragraph className="mb-4">
                    {board?.meta?.title
                        ? `Er du sikker på at du vil slette tavlen "${board.meta.title}"? `
                        : 'Er du sikker på at du vil slette denne tavlen? '}
                    Avgangstavlen vil være borte for godt og ikke mulig å finne
                    tilbake til.
                </Paragraph>

                <form action={action} onSubmit={close} className="w-100">
                    <HiddenInput id="bid" value={board.id} />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <PrimaryButton
                        type="submit"
                        aria-label="Slett tavle"
                        className="w-100"
                    >
                        Ja, slett!
                    </PrimaryButton>
                </form>
            </Modal>
        </>
    )
}

export { Delete }
