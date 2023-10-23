import { PrimaryButton } from '@entur/button'
import { TextField } from '@entur/form'
import { AddIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { createOrganizationRequest } from 'Admin/utils/fetch'
import { useToggle } from 'hooks/useToggle'
import { useRouter } from 'next/router'
import { useState } from 'react'

function CreateOrganization() {
    const [showModal, openModal, closeModal] = useToggle()
    const [organizationName, setOrganizationName] = useState('')
    const router = useRouter()
    const saveOrganization = async () => {
        const req = await createOrganizationRequest(organizationName)
        if (req.status == 200) {
            const organization = await req.json()
            router.push(`/organizations/${organization.oid}`)
        }
    }

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
                <Paragraph>Hva skal organisasjonen din hete?</Paragraph>
                <TextField
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    size="medium"
                    label="Navn på din organisasjon"
                    className="w-50"
                />
                <PrimaryButton className="mt-2" onClick={saveOrganization}>
                    Opprett
                </PrimaryButton>
            </Modal>
        </>
    )
}

export { CreateOrganization }
