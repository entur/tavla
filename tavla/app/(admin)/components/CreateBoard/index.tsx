'use client'
import { AddIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Label, Paragraph } from '@entur/typography'
import { useEffect, useState } from 'react'
import { TBoard, TOrganizationID } from 'types/settings'
import { Checkbox, TextField } from '@entur/form'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { SubmitButton } from 'components/Form/SubmitButton'
import { create } from './actions'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'
import { Dropdown } from '@entur/dropdown'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'

function CreateBoard() {
    const [open, close] = useSearchParamsModal('board')

    const [state, setFormError] = useState<TFormFeedback | undefined>()

    const {
        organizations,
        selectedOrganization,
        setSelectedOrganization,
        fetchOrganizations,
    } = useOrganizations()

    const [personal, setPersonal] = useState<boolean>(false)

    const reset = () => {
        setPersonal(false)
        setSelectedOrganization(null)
        setFormError(undefined)
    }

    useEffect(() => {
        if (open) fetchOrganizations()
    }, [open, fetchOrganizations])

    return (
        <>
            <Modal
                open={open}
                size="medium"
                className="flex flex-col items-center"
                onDismiss={() => {
                    reset()
                    close()
                }}
                closeLabel="Avbryt opprettelse av tavle"
            >
                <form
                    action={async (data: FormData) => {
                        const name = data.get('name') as string
                        if (!name) {
                            return setFormError(
                                getFormFeedbackForError('board/name-missing'),
                            )
                        }

                        const organization = data.get(
                            'organization',
                        ) as TOrganizationID
                        const personal = data.get('personal')
                        if (!organization && !personal) {
                            return setFormError(
                                getFormFeedbackForError(
                                    'create/organization-missing',
                                ),
                            )
                        }

                        const board = {
                            tiles: [],
                            meta: {
                                title: name.substring(0, 50),
                            },
                        } as TBoard

                        await create(board, organization)

                        reset()
                    }}
                    className="w-full md:w-3/4"
                >
                    <Heading3>Velg navn og organisasjon for tavlen</Heading3>
                    <Paragraph className="!mb-4">
                        Gi tavlen et navn og legg den til i en organisasjon.
                        Velger du en organisasjon vil alle i organisasjonen ha
                        tilgang til tavlen.
                    </Paragraph>
                    <Label>Gi tavlen et navn</Label>
                    <TextField
                        size="medium"
                        label="Navn"
                        id="name"
                        name="name"
                        maxLength={50}
                        required
                        {...getFormFeedbackForField('name', state)}
                    />

                    <div className="mt-4">
                        <Label>Legg til i en organisasjon</Label>
                        <Dropdown
                            items={organizations}
                            label="Dine organisasjoner"
                            selectedItem={
                                personal ? null : selectedOrganization
                            }
                            onChange={setSelectedOrganization}
                            clearable
                            aria-required="true"
                            className="mb-4"
                            disabled={personal || organizations().length == 0}
                            {...getFormFeedbackForField('organization', state)}
                        />
                        <Checkbox
                            checked={personal || organizations().length == 0}
                            onChange={() => {
                                setPersonal(!personal)
                                setFormError(undefined)
                            }}
                            name="personal"
                        >
                            Privat tavle
                        </Checkbox>
                        <HiddenInput
                            id="organization"
                            value={selectedOrganization?.value.id}
                        />
                    </div>

                    <div className="flex flex-row mt-8 justify-end">
                        <SubmitButton
                            variant="primary"
                            className="max-sm:w-full"
                        >
                            Opprett tavle
                            <AddIcon />
                        </SubmitButton>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export { CreateBoard }
