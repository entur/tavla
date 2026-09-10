'use client'

import { FilterChip } from '@entur/chip'
import { FeedbackText } from '@entur/form'
import { Paragraph } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState, useState } from 'react'
import { type ElementsState, saveElements } from './actions'
import type { ElementsValue } from './validation'

function EditElements({
    bid,
    hideClock,
    hideLogo,
}: {
    bid: string
    hideClock: boolean
    hideLogo: boolean
}) {
    const { capture } = usePosthogTracking()
    const [elements, setElements] = useState<ElementsValue>({
        hideClock,
        hideLogo,
    })

    async function handleSave(
        _prevState: ElementsState,
        payload: { element: 'clock' | 'logo'; value: ElementsValue },
    ) {
        const result = await saveElements(bid, payload.value)

        if (result?.status === 'success') {
            capture('board_settings_changed', {
                location: 'edit_board_page',
                setting: 'element_select',
                value: payload.element,
            })
            setElements(payload.value)
        }
        return result
    }

    const [state, action] = useActionState(handleSave, null)

    const error = state?.status === 'error' ? state.message : undefined

    function handleToggle(element: 'clock' | 'logo', checked: boolean) {
        const next: ElementsValue = {
            hideClock: element === 'clock' ? !checked : elements.hideClock,
            hideLogo: element === 'logo' ? !checked : elements.hideLogo,
        }

        startTransition(() => {
            action({ element, value: next })
        })
    }

    return (
        <div className="flex flex-col gap-1">
            <Paragraph className="mb-2">Vis elementer</Paragraph>
            <div className="mb-2 flex h-full flex-row gap-3">
                <FilterChip
                    name="clock"
                    value="clock"
                    checked={!elements.hideClock}
                    onChange={(e) => handleToggle('clock', e.target.checked)}
                >
                    Klokke
                </FilterChip>
                <FilterChip
                    name="logo"
                    value="logo"
                    checked={!elements.hideLogo}
                    onChange={(e) => handleToggle('logo', e.target.checked)}
                >
                    Logo
                </FilterChip>
            </div>
            {error && <FeedbackText variant="negative">{error}</FeedbackText>}
        </div>
    )
}

export { EditElements }
