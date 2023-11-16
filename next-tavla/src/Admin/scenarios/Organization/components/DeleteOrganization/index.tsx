'use client'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph, Paragraph } from '@entur/typography'
import { Contrast } from 'Admin/components/Contrast'
import { useToggle } from 'hooks/useToggle'
import { TOrganization, TUserID } from 'types/settings'
import { TextField } from '@entur/form'
import { selectInput } from 'Admin/utils/selectInput'
import { deleteOrganization } from './utils/actions'

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

                <form
                    className="flexColumn g-2 w-100"
                    action={deleteOrganization}
                >
                    <input type="hidden" name="oid" value={organization.id} />
                    <input type="hidden" name="uid" value={uid} />
                    <TextField
                        name="organizationName"
                        label="Organisasjonsnavn"
                        ref={selectInput}
                        aria-label="Skriv inn navnet på organisasjonen for å bekrefte"
                    />

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
