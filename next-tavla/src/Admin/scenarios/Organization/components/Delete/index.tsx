'use client'
import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, LeadParagraph, Paragraph } from '@entur/typography'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { TOrganization, TUserID } from 'types/settings'
import { deleteOrg } from './actions'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TextField } from '@entur/form'
import { SubmitButton } from 'components/Form/SubmitButton'

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
                    action={deleteOrg}
                    className="flexColumn alignCenter textCenter g-2 "
                >
                    <HiddenInput id="uid" value={uid} />
                    <HiddenInput id="oid" value={organization.id} />
                    <HiddenInput id="orgName" value={organization.name} />
                    <TextField
                        name="nameInput"
                        label="Organisasjonsnavn"
                        type="text"
                        required
                    />
                    <SubmitButton variant="primary" className="w-100 g-2">
                        Ja, slett!
                    </SubmitButton>
                </form>
            </Modal>
        </>
    )
}

export { Delete }
