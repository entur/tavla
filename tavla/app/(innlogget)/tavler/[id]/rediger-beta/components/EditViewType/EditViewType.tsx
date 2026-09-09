'use client'

import { FeedbackText } from '@entur/form'
import { ChoiceChipGroupGeneral } from 'app/_components/TableSettings/ChoiceChipGroupGeneral'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState, useRef } from 'react'
import { type FormState, saveViewType } from './actions'
import { type ViewTypeValue, viewTypeSchema } from './validation'

function EditViewType({
    bid,
    hasCombinedTiles,
}: {
    bid: string
    hasCombinedTiles: boolean
}) {
    const { capture } = usePosthogTracking()
    const formRef = useRef<HTMLFormElement>(null)

    async function handleSave(_prevState: FormState, formData: FormData) {
        const result = await saveViewType(bid, _prevState, formData)

        if (result?.status === 'success') {
            const parsed = viewTypeSchema.safeParse(
                formData.get('viewType')?.toString(),
            )
            if (parsed.success) {
                capture('board_settings_changed', {
                    location: 'edit_board_page',
                    setting: 'view_type',
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
            <ChoiceChipGroupGeneral<ViewTypeValue>
                label="Visningstype"
                options={[
                    { value: 'separate', label: 'En liste per stoppested' },
                    {
                        value: 'combined',
                        label: 'Alle stoppesteder i en liste',
                    },
                ]}
                defaultValue={hasCombinedTiles ? 'combined' : 'separate'}
                name="viewType"
                ariaLabel="Visningstype"
                onChange={handleChange}
            />
            {error && <FeedbackText variant="negative">{error}</FeedbackText>}
        </form>
    )
}

export { EditViewType }
