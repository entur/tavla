import { PrimaryButton } from '@entur/button'
import { TextField } from '@entur/form'
import { createOrganizationAction } from 'Admin/utils/formActions'
import { useFormState } from 'react-dom'
import { getFormStateProps } from 'utils/formStatuses'

function CreateOrganizationForm({ closeModal }: { closeModal: () => void }) {
    const [formState, formAction] = useFormState(
        createOrganizationAction,
        undefined,
    )

    if (formState === 'create-org/success') closeModal()

    return (
        <form className="flexColumn alignCenter w-100" action={formAction}>
            <TextField
                size="medium"
                label="Navn på din organisasjon"
                className="w-50"
                {...getFormStateProps(formState)}
                id="organizationName"
                name="organizationName"
            />
            <PrimaryButton className="mt-2" type="submit">
                Opprett
            </PrimaryButton>
        </form>
    )
}

export { CreateOrganizationForm }
