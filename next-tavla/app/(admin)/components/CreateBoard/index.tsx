'use client'
import { ForwardIcon } from '@entur/icons'
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
    const [board, setBoard] = useState<TBoard>()

    const [state, setFormError] = useState<TFormFeedback | undefined>()

    return (
        <>
            <Modal
                open={open}
                size="small"
                className="flex flex-col items-center w-11/12 lg:w-full"
                onDismiss={() => {
                    setBoard(undefined)
                    setFormError(undefined)
                    close()
                }}
                closeLabel="Avbryt opprettelse av tavle"
                data-theme="light"
            >
                <div className="w-full md:w-3/4">
                    <form
                        action={async (data: FormData) => {
                            const name = data.get('name') as string
                            if (!name) {
                                return setFormError(
                                    getFormFeedbackForError(
                                        'board/name-missing',
                                    ),
                                )
                            }
                            await create({
                                tiles: [],
                                ...board,
                                meta: {
                                    ...board?.meta,
                                    title: name.substring(0, 30),
                                },
                            } as TBoard)
                        }}
                    >
                        <Heading3>Velg navn for tavlen</Heading3>
                        <Label className="text-left">Gi tavlen et navn</Label>
                        <TextField
                            size="medium"
                            label="Navn"
                            id="name"
                            name="name"
                            maxLength={30}
                            defaultValue={board?.meta?.title}
                            required
                            {...getFormFeedbackForField('name', state)}
                            className="mb-4"
                        />
                        <div className="flex flex-row w-full ">
                            <SubmitButton variant="primary">
                                Opprett tavle
                                <ForwardIcon />
                            </SubmitButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export { CreateBoard }
