'use client'
import { IconButton, SecondarySquareButton } from '@entur/button'
import { CloseIcon, DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Tooltip } from '@entur/tooltip'
import { Heading2, Paragraph } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useFormState } from 'react-dom'
import { TOrganizationID, TUser } from 'types/settings'
import Image from 'next/image'
import sheep from 'assets/illustrations/Sheep.png'
import { useModalWithValue } from 'app/(admin)/boards/hooks/useModalWithValue'
import { removeUser } from './actions'

function RemoveUserButton({
    user,
    oid,
}: {
    user?: TUser
    oid?: TOrganizationID
}) {
    const [state, formAction] = useFormState(removeUser, undefined)
    const { isOpen, open, close } = useModalWithValue(
        'deleteUser',
        user?.uid ?? '',
    )
    return (
        <>
            <Tooltip content="Slett bruker" placement="bottom">
                <IconButton
                    type="submit"
                    aria-label="Fjern bruker"
                    onClick={open}
                >
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
                <Heading2>Slett medlem</Heading2>
                <Paragraph className="mt-2">
                    Er du sikker på at du vil slette medlem med e-postadresse{' '}
                    {user?.email} fra organisasjonen?
                </Paragraph>
                <form
                    action={formAction}
                    onSubmit={close}
                    className="flexColumn w-100 g-2"
                    aria-live="polite"
                    aria-relevant="all"
                >
                    <HiddenInput id="uid" value={user?.uid} />
                    <HiddenInput id="oid" value={oid} />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <SubmitButton
                        variant="primary"
                        width="fluid"
                        aria-label="Slett bruker"
                    >
                        Ja, slett
                    </SubmitButton>
                </form>
            </Modal>
        </>
    )
}

export { RemoveUserButton }
