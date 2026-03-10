'use client'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { FormError } from 'app/(admin)/components/FormError'
import {
    getFormFeedbackForField,
    InputType,
    TFormFeedback,
} from 'app/(admin)/utils'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { useCallback, useState } from 'react'
import { BoardDB } from 'src/types/db-types/boards'
import { saveSettings } from './actions'
import { SettingsForm } from './components/SettingsForm'

function Settings({ board }: { board: BoardDB }) {
    const [formErrors, setFormErrors] = useState<
        Partial<Record<InputType, TFormFeedback>>
    >({})

    const onSubmit = useCallback(async (data: FormData) => {
        const resultingErrors = await saveSettings(data)
        setFormErrors(resultingErrors ?? {})
    }, [])

    return (
        <SettingsForm
            board={{
                ...board,
                meta: {
                    ...board.meta,
                    title: board.meta?.title ?? DEFAULT_BOARD_NAME,
                },
            }}
            onSubmit={onSubmit}
            formError={
                <FormError
                    {...getFormFeedbackForField('general', formErrors.general)}
                />
            }
            titleFeedback={getFormFeedbackForField('name', formErrors.name)}
            additionalInputs={<HiddenInput id="bid" value={board.id} />}
        />
    )
}

export { Settings }
