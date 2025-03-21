'use client'
import { Button, ButtonGroup, IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph, SubParagraph } from '@entur/typography'
import { TOrganization } from 'types/settings'
import { SubmitButton } from 'components/Form/SubmitButton'
import {
    getFormFeedbackForError,
    getFormFeedbackForField,
    TFormFeedback,
} from 'app/(admin)/utils'
import { FormError } from '../FormError'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'
import { deleteOrganization } from './actions'
import ducks from 'assets/illustrations/Ducks.png'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Tooltip } from '@entur/tooltip'
import Link from 'next/link'
import { useToast } from '@entur/alert'
import { useActionState, useState } from 'react'
import { HiddenInput } from 'components/Form/HiddenInput'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'

function DeleteOrganization({
    organization,
    type,
}: {
    organization: TOrganization
    type: 'icon' | 'secondary'
}) {
    const [modalIsOpen, close] = useSearchParamsModal('delete')
    const { addToast } = useToast()
    const [state, deleteOrgAction] = useActionState(
        deleteOrganization,
        undefined,
    )
    const [nameError, setNameError] = useState<TFormFeedback>()

    const params = useSearchParams()
    const pageParam = params?.get('delete')

    const DeleteButton = type === 'icon' ? IconButton : Button

    const submit = async (data: FormData) => {
        const name = data.get('name') as string
        if (name !== organization.name)
            return setNameError(
                getFormFeedbackForError('organization/name-mismatch'),
            )

        deleteOrgAction(data)
        addToast('Mappe slettet!')
    }

    return (
        <>
            <Tooltip
                content="Slett mappe"
                placement="bottom"
                id="tooltip-delete-org"
            >
                <DeleteButton
                    as={Link}
                    href={`?delete=${organization.id}`}
                    className="gap-4"
                    variant="secondary"
                    aria-label="Slett mappe"
                >
                    {type === 'secondary' && 'Slett'}
                    <DeleteIcon />
                </DeleteButton>
            </Tooltip>

            <Modal
                open={modalIsOpen && pageParam === organization.id}
                size="small"
                onDismiss={() => {
                    close()
                    setNameError(undefined)
                }}
                closeLabel="Avbryt sletting"
                className="flex flex-col text-center"
            >
                <Image src={ducks} alt="" className="h-1/2 w-1/2 mx-auto" />
                <Heading3 margin="bottom" as="h1">
                    Slett mappe
                </Heading3>
                <Paragraph>
                    {`Er du sikker på at du vil slette mappen 
                    "${organization.name}"? Alle tavlene i mappen vil også bli slettet.`}
                </Paragraph>
                <SubParagraph className="font-medium text-left">
                    Bekreft ved å skrive inn navnet på mappen
                </SubParagraph>
                <form action={submit} aria-live="polite" aria-relevant="all">
                    <HiddenInput id="oname" value={organization.name} />
                    <HiddenInput id="oid" value={organization.id} />

                    <ClientOnlyTextField
                        name="name"
                        label="Mappenavn"
                        type="text"
                        required
                        aria-required
                        {...getFormFeedbackForField('name', nameError)}
                    />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <ButtonGroup className="flex flex-row mt-8">
                        <SubmitButton
                            variant="primary"
                            aria-label="Ja, slett!"
                            className="w-1/2"
                            width="fluid"
                        >
                            Ja, slett!
                        </SubmitButton>
                        <Button
                            type="button"
                            variant="secondary"
                            aria-label="Avbryt sletting"
                            onClick={() => {
                                close()
                                setNameError(undefined)
                            }}
                            width="fluid"
                            className="w-1/2"
                        >
                            Avbryt
                        </Button>
                    </ButtonGroup>
                </form>
            </Modal>
        </>
    )
}

export { DeleteOrganization }
