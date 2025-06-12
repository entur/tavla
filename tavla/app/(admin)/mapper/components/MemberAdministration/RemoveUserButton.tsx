'use client'
import { useActionState } from 'react'
import { Button, ButtonGroup, IconButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TOrganizationID, TUser } from 'types/settings'
import Image from 'next/image'
import sheep from 'assets/illustrations/Sheep.png'
import { removeUserAction } from './actions'
import { DeleteButton } from 'app/(admin)/oversikt/components/Column/Delete'
import { useModalWithValues } from 'app/(admin)/oversikt/hooks/useModalWithValue'
import { CloseIcon } from '@entur/icons'

function RemoveUserButton({
    user,
    oid,
}: {
    user?: TUser
    oid?: TOrganizationID
}) {
    const [state, deleteUser] = useActionState(removeUserAction, undefined)
    const { isOpen, open, close } = useModalWithValues(
        {
            key: 'slett',
            value: 'bruker',
        },
        {
            key: 'id',
            value: user?.uid ?? '',
        },
    )
    return (
        <>
            <DeleteButton text="Slett bruker" type="icon" onClick={open} />
            <Modal
                open={isOpen}
                size="small"
                onDismiss={close}
                closeLabel="Avbryt sletting"
                className="flex flex-col items-center text-center"
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={close}
                    className="absolute right-4 top-4"
                >
                    <CloseIcon />
                </IconButton>
                <Image src={sheep} alt="" className="h-1/2 w-1/2" />
                <Heading3 margin="bottom" as="h1">
                    Slett medlem
                </Heading3>
                <Paragraph>
                    Er du sikker på at du vil slette medlem med e-postadresse{' '}
                    {user?.email} fra mappen?
                </Paragraph>
                <form
                    action={deleteUser}
                    onSubmit={close}
                    aria-live="polite"
                    aria-relevant="all"
                >
                    <HiddenInput id="uid" value={user?.uid} />
                    <HiddenInput id="oid" value={oid} />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <ButtonGroup className="flex flex-row">
                        <SubmitButton
                            variant="primary"
                            width="fluid"
                            aria-label="Ja, slett"
                            className="w-1/2"
                        >
                            Ja, slett
                        </SubmitButton>

                        <Button
                            type="button"
                            width="fluid"
                            variant="secondary"
                            aria-label="Avbryt"
                            onClick={close}
                            className="w-1/2"
                        >
                            Avbryt
                        </Button>
                    </ButtonGroup>
                </form>
            </Modal>
        </>
    )
}

export { RemoveUserButton }
