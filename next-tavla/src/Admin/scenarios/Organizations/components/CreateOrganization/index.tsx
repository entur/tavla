'use client'
import { PrimaryButton } from '@entur/button'
import { AddIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { useToggle } from 'hooks/useToggle'
import { CreateOrganizationForm } from './CreateOrganizationForm'

function CreateOrganization() {
    const [showModal, openModal, closeModal] = useToggle()

    return (
        <>
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
                <CreateOrganizationForm closeModal={closeModal} />
            </Modal>
        </>
    )
}

export { CreateOrganization }
