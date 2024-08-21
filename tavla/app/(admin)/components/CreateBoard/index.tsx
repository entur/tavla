'use client'
import { AddIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Label } from '@entur/typography'
import { useState } from 'react'
import { TBoard } from 'types/settings'
import { TextField } from '@entur/form'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { SubmitButton } from 'components/Form/SubmitButton'
import { create } from './actions'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'

function CreateBoard() {
    const [open, close] = useSearchParamsModal('board')

    const [state, setFormError] = useState<TFormFeedback | undefined>()

    return (
        <>
            <Modal
                open={open}
                size="medium"
                className="flex flex-col items-center"
                onDismiss={() => {
                    setFormError(undefined)
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
                        await create({
                            tiles: [],
                            meta: {
                                title: name.substring(0, 30),
                            },
                        } as TBoard)
                    }}
                    className="w-full md:w-3/4"
                >
                    <Heading3>Hva skal tavlen hete?</Heading3>
                    <Label>Gi tavlen et navn</Label>
                    <TextField
                        size="medium"
                        label="Navn"
                        id="name"
                        name="name"
                        maxLength={30}
                        required
                        {...getFormFeedbackForField('name', state)}
                    />
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
