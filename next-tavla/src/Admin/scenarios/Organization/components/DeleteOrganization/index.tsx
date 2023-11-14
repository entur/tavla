'use client'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph } from '@entur/typography'
import { Contrast } from 'Admin/components/Contrast'
import { TavlaError } from 'Admin/types/error'
import { useToggle } from 'hooks/useToggle'
import { TOrganization } from 'types/settings'
import { fetchDeleteOrganization } from './utils/fetch'
import { useRouter } from 'next/navigation'

function DeleteOrganization({ organization }: { organization: TOrganization }) {
    const [showModal, openModal, closeModal] = useToggle()
    const router = useRouter()

    const deleteOrganizationHandler = async () => {
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
            <PrimaryButton onClick={openModal}>
                Slett organisasjon
            </PrimaryButton>
            <Modal
                open={showModal}
                size="small"
                onDismiss={closeModal}
                closeLabel="Avbryt sletting"
                className="flexColumn justifyStart alignCenter textCenter"
            >
                <Heading1>Slett organisasjon</Heading1>
                <LeadParagraph>{`Er du sikker på at du vil slette organisasjonen "${organization.name}"`}</LeadParagraph>
                <div className="flexRow justifyAround alignCenter g-2">
                    <SecondaryButton
                        aria-label="Avbryt sletting"
                        onClick={closeModal}
                    >
                        Avbryt
                    </SecondaryButton>
                    <PrimaryButton
                        aria-label="Slett organisasjon"
                        onClick={deleteOrganizationHandler}
                    >
                        Ja, slett!
                    </PrimaryButton>
                </div>
            </Modal>
        </Contrast>
    )
}

export { DeleteOrganization }
