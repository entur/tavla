'use client'
import { SettingsForm } from 'app/_components/table_editor/TableSettings/SettingsForm'
import { HiddenInput } from 'app/(innlogget)/components/Form/HiddenInput'
import { FormError } from 'app/(innlogget)/components/FormError'
import { DEFAULT_BOARD_NAME } from 'app/(innlogget)/utils/constants'
import {
    getFormFeedbackForField,
    type InputType,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { useCallback, useState } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { saveSettings } from './actions'

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
