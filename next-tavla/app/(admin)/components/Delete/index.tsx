'use client'
import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, LeadParagraph, Paragraph } from '@entur/typography'
import Link from 'next/link'
import { TOrganization } from 'types/settings'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TextField } from '@entur/form'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useFormState } from 'react-dom'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from '../FormError'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'
import { deleteOrganization } from './actions'

function Delete({ organization }: { organization: TOrganization }) {
    const [modalIsOpen, close] = useSearchParamsModal('delete')

    const [state, action] = useFormState(deleteOrganization, undefined)

    return (
        <>
            <IconButton as={Link} href="?delete" className="g-2">
                <DeleteIcon />
                Slett
            </IconButton>
            <Modal
                open={modalIsOpen}
                size="small"
                onDismiss={close}
                closeLabel="Avbryt sletting"
                className="flexColumn justifyStart alignCenter textCenter"
            >
                <Heading3>Slett organisasjon</Heading3>
                <LeadParagraph>
                    Er du sikker på at du vil slette organisasjonen{' '}
                    {organization.name}?
                </LeadParagraph>
                <Paragraph>
                    Skriv inn navnet på organisasjonen for å bekrefte.
                </Paragraph>
                <form action={action} className="flexColumn w-100 g-2">
                    <HiddenInput id="oname" value={organization.name} />
                    <HiddenInput id="oid" value={organization.id} />

                    <TextField
                        name="name"
                        label="Organisasjonsnavn"
                        type="text"
                        required
                        className="w-100"
                        {...getFormFeedbackForField('name', state)}
                    />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <SubmitButton variant="primary" width="fluid">
                        Ja, slett!
                    </SubmitButton>
                </form>
            </Modal>
        </>
    )
}

export { Delete }
