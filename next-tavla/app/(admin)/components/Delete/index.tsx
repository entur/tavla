'use client'
import { IconButton, SecondarySquareButton } from '@entur/button'
import { CloseIcon, DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading2, Label, Paragraph } from '@entur/typography'
import Link from 'next/link'
import { TOrganization } from 'types/settings'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TextField } from '@entur/form'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useFormState } from 'react-dom'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from '../FormError'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'
import { deleteOrganization } from './actions'
import { Tooltip } from '@entur/tooltip'
import ducks from 'assets/illustrations/Ducks.png'
import Image from 'next/image'
function Delete({
    organization,
    showText,
}: {
    organization: TOrganization
    showText?: boolean
}) {
    const [modalIsOpen, close] = useSearchParamsModal('delete')

    const [state, action] = useFormState(deleteOrganization, undefined)

    return (
        <>
            <Tooltip content="Slett organisasjon" placement="bottom">
                <IconButton as={Link} href="?delete" className="g-2">
                    <DeleteIcon />
                    {showText && 'Slett'}
                </IconButton>
            </Tooltip>
            <Modal
                open={modalIsOpen}
                size="small"
                onDismiss={close}
                closeLabel="Avbryt sletting"
                className="flexColumn justifyStart alignCenter textCenter"
            >
                <SecondarySquareButton
                    aria-label="Avbryt sletting"
                    className="ml-auto"
                    onClick={close}
                >
                    <CloseIcon />
                </SecondarySquareButton>
                <Image src={ducks} alt="" className="h-50 w-50" />
                <Heading2>Slett organisasjon</Heading2>
                <Paragraph className="mt-2">
                    {`Er du sikker på at du vil slette organisasjonen 
                    "${organization.name}"?`}
                </Paragraph>
                <Paragraph>
                    Organisasjonen vil være borte for godt og ikke mulig å finne
                    tilbake til for andre medlemmer.
                </Paragraph>
                <form
                    action={action}
                    className="flexColumn w-100 g-2"
                    aria-live="polite"
                    aria-relevant="all"
                >
                    <HiddenInput id="oname" value={organization.name} />
                    <HiddenInput id="oid" value={organization.id} />
                    <TextField
                        name="name"
                        label="Organisasjonsnavn"
                        type="text"
                        required
                        aria-required
                        className="w-100"
                        {...getFormFeedbackForField('name', state)}
                    />
                    <Label className="weight500 textLeft">
                        Bekreft ved å skrive inn navnet på organisasjonen
                    </Label>
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <SubmitButton
                        variant="primary"
                        width="fluid"
                        aria-label="Slett organisasjon"
                    >
                        Ja, slett organisasjon
                    </SubmitButton>
                </form>
            </Modal>
        </>
    )
}

export { Delete }
