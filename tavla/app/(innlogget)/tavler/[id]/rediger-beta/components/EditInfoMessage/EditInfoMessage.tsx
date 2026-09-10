'use client'
import { TextField } from '@entur/form'
import { Label, Paragraph } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState, useState } from 'react'
import type { BoardFooter } from 'src/types/db-types/boards'
import { type InfoMessageState, saveInfoMessage } from './actions'
import { INFO_MESSAGE_MAX_LENGTH } from './validation'

function hasUnsavedChanges(currentValue: string, savedValue: string) {
    return currentValue.trim() !== savedValue.trim()
}

function EditInfoMessage({
    bid,
    infoMessage,
}: {
    bid: string
    infoMessage?: BoardFooter
}) {
    const { capture } = usePosthogTracking()

    const [value, setValue] = useState(infoMessage?.footer ?? '')
    const [savedValue, setSavedValue] = useState(infoMessage?.footer ?? '')

    async function handleSave(_prevState: InfoMessageState, value: string) {
        const result = await saveInfoMessage(bid, value)

        if (result?.status === 'success') {
            const trimmed = value.trim()
            setValue(trimmed)
            setSavedValue(trimmed)
            capture('board_settings_changed', {
                location: 'edit_board_page',
                setting: 'info_message',
                value: 'changed',
            })
        }

        return result
    }

    const [state, action] = useActionState(handleSave, null)

    const error = state?.status === 'error' ? state.message : undefined

    function handleBlur() {
        if (!hasUnsavedChanges(value, savedValue)) return
        startTransition(() => {
            action(value)
        })
    }

    return (
        <div className="flex flex-col">
            <Paragraph className="mb-2">Infomelding</Paragraph>
            <Label>Skriv en kort tekst som vises nederst på tavla</Label>
            <TextField
                label="Infomelding"
                name="infoMessage"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                maxLength={INFO_MESSAGE_MAX_LENGTH}
                variant={error ? 'negative' : undefined}
                feedback={error}
                className="w-full"
            />
        </div>
    )
}

export { EditInfoMessage }
