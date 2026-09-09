'use client'

import { FeedbackText } from '@entur/form'
import { ChoiceChipGroupGeneral } from 'app/_components/TableSettings/ChoiceChipGroupGeneral'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState, useRef } from 'react'
import { type FormState, saveTheme } from './actions'
import { type ThemeValue, themeSchema } from './validation'

function EditTheme({ bid, theme }: { bid: string; theme: ThemeValue }) {
    const { capture } = usePosthogTracking()
    const formRef = useRef<HTMLFormElement>(null)

    async function handleSave(_prevState: FormState, formData: FormData) {
        const result = await saveTheme(bid, _prevState, formData)

        if (result?.status === 'success') {
            const parsed = themeSchema.safeParse(
                formData.get('theme')?.toString(),
            )
            if (parsed.success) {
                capture('board_settings_changed', {
                    setting: 'theme',
                    value: parsed.data,
                })
            }
        }

        return result
    }

    const [state, formAction] = useActionState(handleSave, null)

    const error = state?.status === 'error' ? state.message : undefined

    const handleChange = () => {
        if (!formRef.current) return
        const formData = new FormData(formRef.current)
        startTransition(() => {
            formAction(formData)
        })
    }

    return (
        <form action={formAction} ref={formRef}>
            <ChoiceChipGroupGeneral<ThemeValue>
                label="Fargetema"
                options={[
                    { value: 'dark', label: 'Mørkt' },
                    {
                        value: 'light',
                        label: 'Lyst',
                    },
                ]}
                defaultValue={theme}
                name="theme"
                ariaLabel="Fargetema"
                onChange={handleChange}
            />
            {error && (
                <div role="alert" aria-live="polite">
                    <FeedbackText variant="negative">{error}</FeedbackText>
                </div>
            )}
        </form>
    )
}

export { EditTheme }
