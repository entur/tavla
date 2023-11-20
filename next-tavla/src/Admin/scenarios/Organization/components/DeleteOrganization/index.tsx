'use client'
import { SecondaryButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph, Paragraph } from '@entur/typography'
import { Contrast } from 'Admin/components/Contrast'
import { useToggle } from 'hooks/useToggle'
import { TOrganization, TUserID } from 'types/settings'
import { Form } from './components/Form'

function DeleteOrganization({
    organization,
    uid,
}: {
    organization: TOrganization
    uid?: TUserID
}) {
    const [showModal, openModal, closeModal] = useToggle()

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

                <Form
                    organization={organization}
                    uid={uid}
                    closeModal={closeModal}
                />
            </Modal>
        </Contrast>
    )
}

export { DeleteOrganization }
