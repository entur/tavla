'use client'
import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, LeadParagraph, Paragraph } from '@entur/typography'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { TOrganization, TUserID } from 'types/settings'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TextField } from '@entur/form'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useFormState } from 'react-dom'
import { deleteOrganization } from './actions'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { FirebaseError } from 'firebase/app'
import { FormError } from '../FormError'

function Delete({
    organization,
    uid,
}: {
    organization: TOrganization
    uid?: TUserID
}) {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()

    const modalIsOpen = params?.has('delete') ?? false

    const submit = async (p: TFormFeedback | undefined, data: FormData) => {
        if (!organization.id || !uid) return getFormFeedbackForError('general')

        const nameInput = data.get('nameInput') as string

        if (nameInput !== organization.name)
            return getFormFeedbackForError('organization/name-mismatch')

        try {
            await deleteOrganization(organization.id, uid)
        } catch (e) {
            if (e instanceof FirebaseError) {
                return getFormFeedbackForError(e)
            }
            return getFormFeedbackForError('general')
        }
    }

    const [state, action] = useFormState(submit, undefined)

    return (
        <>
            <IconButton as={Link} href="?delete" className="g-2">
                <DeleteIcon />
                Slett
            </IconButton>
            <Modal
                open={modalIsOpen}
                size="small"
                onDismiss={() => router.push(pathname ?? '/')}
                closeLabel="Avbryt sletting"
                className="flexColumn justifyStart alignCenter textCenter"
            >
                <Heading3>Slett organisasjon</Heading3>
                <LeadParagraph>{`Er du sikker på at du vil slette organisasjonen "${organization.name}"?`}</LeadParagraph>
                <Paragraph>
                    Skriv inn navnet på organisasjonen for å bekrefte.
                </Paragraph>
                <form
                    action={action}
                    className="flexColumn alignCenter textCenter w-100 g-2 "
                >
                    <HiddenInput id="orgName" value={organization.name} />
                    <TextField
                        name="nameInput"
                        label="Organisasjonsnavn"
                        type="text"
                        required
                        className="w-100"
                    />
                    <FormError
                        {...getFormFeedbackForField('organization_name', state)}
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
