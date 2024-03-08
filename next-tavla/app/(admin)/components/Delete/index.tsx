'use client'
import { Button, IconButton, SecondarySquareButton } from '@entur/button'
import { CloseIcon, DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading2, Label, Paragraph } from '@entur/typography'
import { TOrganization } from 'types/settings'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TextField } from '@entur/form'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useFormState } from 'react-dom'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from '../FormError'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'
import { deleteOrganization } from './actions'
import ducks from 'assets/illustrations/Ducks.png'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Tooltip } from '@entur/tooltip'
import Link from 'next/link'

function Delete({
    organization,
    type,
}: {
    organization: TOrganization
    type: 'icon' | 'secondary'
}) {
    const [modalIsOpen, close] = useSearchParamsModal('delete')

    const [state, action] = useFormState(deleteOrganization, undefined)

    const params = useSearchParams()
    const pageParam = params?.get('delete')

    const DeleteButton = type === 'icon' ? IconButton : Button

    return (
        <>
            <Tooltip content="Slett organisasjon" placement="bottom">
                <DeleteButton
                    as={Link}
                    href={`?delete=${organization.id}`}
                    className="g-2"
                    variant="secondary"
                >
                    {type === 'secondary' && 'Slett'}
                    <DeleteIcon />
                </DeleteButton>
            </Tooltip>
            <Modal
                open={modalIsOpen && pageParam === organization.id}
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
                <Image src={ducks} alt="" className="h-50 w-50" />
                <Heading2>Slett organisasjon</Heading2>
                <Paragraph className="mt-2">
                    {`Er du sikker på at du vil slette organisasjonen 
                    "${organization.name}"?`}
                </Paragraph>
                <form
                    action={action}
                    className="flexColumn w-100 g-2"
                    aria-live="polite"
                    aria-relevant="all"
                >
                    <HiddenInput id="oname" value={organization.name} />
                    <HiddenInput id="oid" value={organization.id} />
                    <Label className="weight500 textLeft">
                        Bekreft ved å skrive inn navnet på organisasjonen
                    </Label>
                    <TextField
                        name="name"
                        label="Organisasjonsnavn"
                        type="text"
                        required
                        aria-required
                        className="w-100"
                        {...getFormFeedbackForField('name', state)}
                    />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <SubmitButton
                        variant="primary"
                        width="fluid"
                        aria-label="Slett organisasjon"
                    >
                        Ja, slett organisasjon
                    </SubmitButton>
                </form>
            </Modal>
        </>
    )
}

export { Delete }
