'use client'
import { Button, IconButton, SecondarySquareButton } from '@entur/button'
import { CloseIcon, DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading2, Label, Paragraph } from '@entur/typography'
import { TOrganization } from 'types/settings'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TextField } from '@entur/form'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useFormState } from 'react-dom'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from '../FormError'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'
import { deleteOrganization } from './actions'
import ducks from 'assets/illustrations/Ducks.png'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Tooltip } from '@entur/tooltip'
import Link from 'next/link'
import { useToast } from '@entur/alert'

function Delete({
    organization,
    type,
}: {
    organization: TOrganization
    type: 'icon' | 'secondary'
}) {
    const [modalIsOpen, close] = useSearchParamsModal('delete')
    const { addToast } = useToast()
    const [state, deleteOrgAction] = useFormState(deleteOrganization, undefined)

    const params = useSearchParams()
    const pageParam = params?.get('delete')

    const DeleteButton = type === 'icon' ? IconButton : Button

    const submit = async (data: FormData) => {
        deleteOrgAction(data)
        addToast('Organisasjon slettet!')
    }

    return (
        <>
            <Tooltip content="Slett organisasjon" placement="bottom">
                <DeleteButton
                    as={Link}
                    href={`?delete=${organization.id}`}
                    className="gap-4"
                    variant="secondary"
                    aria-label="Slett organisasjon"
                    size="medium"
                >
                    {type === 'secondary' && 'Slett'}
                    <DeleteIcon />
                </DeleteButton>
            </Tooltip>
            <Modal
                open={modalIsOpen && pageParam === organization.id}
                size="small"
                onDismiss={close}
                closeLabel="Avbryt sletting"
                className="flex flex-col justify-start items-center text-center"
            >
                <SecondarySquareButton
                    aria-label="Avbryt sletting"
                    className="ml-auto"
                    onClick={close}
                >
                    <CloseIcon />
                </SecondarySquareButton>
                <Image src={ducks} alt="" className="h-1/2 w-1/2" />
                <Heading2>Slett organisasjon</Heading2>
                <Paragraph className="mt-8">
                    {`Er du sikker på at du vil slette organisasjonen 
                    "${organization.name}"? Alle tavlene i organisasjonen vil også bli slettet.`}
                </Paragraph>
                <form
                    action={submit}
                    className="flex flex-col w-full gap-4"
                    aria-live="polite"
                    aria-relevant="all"
                >
                    <HiddenInput id="oname" value={organization.name} />
                    <HiddenInput id="oid" value={organization.id} />
                    <Label className="font-medium text-left">
                        Bekreft ved å skrive inn navnet på organisasjonen
                    </Label>
                    <TextField
                        name="name"
                        label="Organisasjonsnavn"
                        type="text"
                        required
                        aria-required
                        className="w-full"
                        {...getFormFeedbackForField('name', state)}
                    />
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
