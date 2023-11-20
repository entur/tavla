'use client'
import { TOrganization, TUserID } from 'types/settings'
import { deleteOrganization } from '../utils/actions'
import { TextField } from '@entur/form'
import { selectInput } from 'Admin/utils/selectInput'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { useFormFeedback } from 'hooks/useFormFeedback'
import { redirect } from 'next/navigation'

function Form({
    organization,
    uid,
    closeModal,
}: {
    organization: TOrganization
    uid?: TUserID
    closeModal: () => void
}) {
    const { setFeedback, clearFeedback, getTextFieldProps } = useFormFeedback()
    const clientAction = async (data: FormData) => {
        clearFeedback()
        if (!organization.id || !uid) {
            return setFeedback('error')
        }
        if (data.get('organizationName') !== organization.name) {
            return setFeedback('delete/name-mismatch')
        }

        await deleteOrganization(organization.id, uid)
        redirect('/organizations')
    }
    return (
        <form className="flexColumn g-2 w-100" action={clientAction}>
            <input type="hidden" name="oid" value={organization.id} />
            <input type="hidden" name="uid" value={uid} />
            <TextField
                name="organizationName"
                label="Organisasjonsnavn"
                ref={selectInput}
                aria-label="Skriv inn navnet på organisasjonen for å bekrefte"
                {...getTextFieldProps()}
            />

            <div className="flexRow justifyBetween alignCenter g-2">
                <SecondaryButton
                    aria-label="Avbryt sletting"
                    onClick={closeModal}
                >
                    Avbryt
                </SecondaryButton>
                <PrimaryButton aria-label="Slett organisasjon" type="submit">
                    Ja, slett!
                </PrimaryButton>
            </div>
        </form>
    )
}

export { Form }
