'use client'
import { TextField } from '@entur/form'
import { Label, Paragraph } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useActionState, useState } from 'react'
import type { BoardFooter } from 'src/types/db-types/boards'
import { type FormState, saveInfoMessage } from './action'

export function InfoMessageForm({
    bid,
    infoMessage,
}: {
    bid: string
    infoMessage?: BoardFooter
}) {
    const { capture } = usePosthogTracking()
    const [value, setValue] = useState(infoMessage?.footer ?? '')

    async function handleSave(_prevState: FormState, formData: FormData) {
        const result = await saveInfoMessage(bid, _prevState, formData)

        if (result?.status === 'success') {
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
        <form action={formAction} className="flex flex-col">
            <Label htmlFor="infoMessage" className="text-lg text-primary">
                Infomelding
            </Label>
            <Paragraph variant="small" className="mb-2 text-[#626493]">
                Skriv en kort tekst som vises nederst på tavla.
            </Paragraph>
            <TextField
                label="Infomelding"
                name="infoMessage"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                variant={error ? 'negative' : undefined}
                feedback={error}
                className="w-full"
                onBlur={(e) => {
                    if (value === (infoMessage?.footer ?? '')) return
                    e.currentTarget.form?.requestSubmit()
                }}
            />
        </form>
    )
}
