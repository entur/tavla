'use client'
import { TextField } from '@entur/form'
import { Paragraph } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useActionState, useRef, useState } from 'react'
import type { BoardFooter } from 'src/types/db-types/boards'
import { type FormState, saveInfoMessage } from './action'
import { INFO_MESSAGE_MAX_LENGTH } from './validation'

function hasUnsavedChanges(currentValue: string, savedValue: string) {
    return currentValue.trim() !== savedValue.trim()
}

export function InfoMessageForm({
    bid,
    infoMessage,
}: {
    bid: string
    infoMessage?: BoardFooter
}) {
    const { capture } = usePosthogTracking()
    const [value, setValue] = useState(infoMessage?.footer ?? '')
    const formRef = useRef<HTMLFormElement>(null)

    async function handleSave(_prevState: FormState, formData: FormData) {
        const result = await saveInfoMessage(bid, _prevState, formData)

        if (result?.status === 'success') {
            setValue((current) => current.trim())
            capture('board_settings_changed', {
                setting: 'info_message',
                value: 'changed',
            })
        }

        return result
    }

    const [state, formAction] = useActionState(handleSave, null)

    const error = state?.status === 'error' ? state.message : undefined

    return (
        <form action={formAction} ref={formRef} className="flex flex-col">
            {/* Dette er stylet litt rart i påvente av at linje lanserer ny versjon av TextField */}
            <Paragraph variant="small" className="mb-2 text-lg">
                Infomelding
            </Paragraph>
            <Paragraph variant="small" className="mb-2 text-[#626493]">
                Skriv en kort tekst som vises nederst på tavla.
            </Paragraph>
            <TextField
                label="Infomelding"
                name="infoMessage"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                maxLength={INFO_MESSAGE_MAX_LENGTH}
                variant={error ? 'negative' : undefined}
                feedback={error}
                className="w-full"
                onBlur={() => {
                    if (!hasUnsavedChanges(value, infoMessage?.footer ?? ''))
                        return
                    formRef.current?.requestSubmit()
                }}
            />
        </form>
    )
}
