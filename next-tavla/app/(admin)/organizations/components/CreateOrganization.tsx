'use client'
import { PrimaryButton } from '@entur/button'
import { AddIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { useToggle } from 'hooks/useToggle'
import { TextField } from '@entur/form'
import { useFormState } from 'react-dom'
import { createOrganizationAction } from 'Admin/utils/formActions'
import { ToastProvider } from '@entur/alert'

function CreateOrganization() {
    const [showModal, openModal, closeModal] = useToggle()
    const [formState, formAction] = useFormState(
        createOrganizationAction,
        undefined,
    )

    return (
        <ToastProvider>
            <PrimaryButton onClick={openModal}>
                Opprett organisasjon
                <AddIcon />
            </PrimaryButton>
            <Modal
                className="flexColumn alignCenter"
                open={showModal}
                size="medium"
                onDismiss={closeModal}
                title="Opprett organisasjon"
                closeLabel="Avbryt oppretting av organisasjon"
            >
                <Paragraph>
                    Organisasjonen gir deg mulighet til å samarbeide om tavler
                    med andre brukere.
                </Paragraph>
                <form
                    className="flexColumn alignCenter w-100"
                    action={formAction}
                >
                    <TextField
                        size="medium"
                        label="Navn på din organisasjon"
                        className="w-50"
                        id="organizationName"
                        name="organizationName"
                        {...getFormStateProps(formState)}
                    />
                    <PrimaryButton className="mt-2" type="submit">
                        Opprett
                    </PrimaryButton>
                </form>
            </Modal>
        </ToastProvider>
    )
}

export { CreateOrganization }
