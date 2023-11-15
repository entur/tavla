'use client'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph, Paragraph } from '@entur/typography'
import { Contrast } from 'Admin/components/Contrast'
import { TavlaError } from 'Admin/types/error'
import { useToggle } from 'hooks/useToggle'
import { TOrganization } from 'types/settings'
import { fetchDeleteOrganization } from './utils/fetch'
import { useRouter } from 'next/navigation'
import { TextField } from '@entur/form'
import { selectInput } from 'Admin/utils/selectInput'
import { SyntheticEvent, useState } from 'react'
import { TOrgError } from 'Admin/types/organizations'
import { UserError } from './UserError'

function DeleteOrganization({ organization }: { organization: TOrganization }) {
    const [showModal, openModal, closeModal] = useToggle()
    const router = useRouter()
    const [error, setError] = useState<TOrgError | undefined>(undefined)

    const deleteOrganizationHandler = async (event: SyntheticEvent) => {
        event.preventDefault()

        const data = event.currentTarget as unknown as {
            organizationName: HTMLInputElement
        }

        const organizationName = data.organizationName.value

        if (organizationName !== organization.name) {
            setError({
                type: 'INVALID_ORGANIZATION_NAME',
                value: 'Organisasjonsnavnet er feil',
            } as TOrgError)
            return
        }

        closeModal()
        try {
            if (!organization.id)
                throw new TavlaError({
                    code: 'NOT_FOUND',
                    message: 'Organization ID is undefined',
                })
            await fetchDeleteOrganization(organization.id)
            router.push('/organizations')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Contrast>
            <SecondaryButton onClick={openModal}>
                Slett organisasjon
            </SecondaryButton>
            <Modal
                open={showModal}
                size="small"
                onDismiss={closeModal}
                closeLabel="Avbryt sletting"
                className="flexColumn justifyStart alignCenter textCenter"
            >
                <Heading1>Slett organisasjon</Heading1>
                <LeadParagraph>{`Er du sikker på at du vil slette organisasjonen "${organization.name}"?`}</LeadParagraph>
                <Paragraph>
                    Skriv inn navnet på organisasjonen for å bekrefte.
                </Paragraph>

                <form
                    className="flexColumn g-2 w-100"
                    onSubmit={deleteOrganizationHandler}
                >
                    <TextField
                        name="organizationName"
                        label="Organisasjonsnavn"
                        ref={selectInput}
                        aria-label="Skriv inn navnet på organisasjonen for å bekrefte"
                    />

                    <UserError error={error} />

                    <div className="flexRow justifyBetween alignCenter g-2">
                        <SecondaryButton
                            aria-label="Avbryt sletting"
                            onClick={closeModal}
                        >
                            Avbryt
                        </SecondaryButton>
                        <PrimaryButton
                            aria-label="Slett organisasjon"
                            type="submit"
                        >
                            Ja, slett!
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </Contrast>
    )
}

export { DeleteOrganization }
