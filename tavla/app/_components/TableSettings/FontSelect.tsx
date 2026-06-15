'use client'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import type { BoardFontSize } from 'types/db-types/boards'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'

function FontSelect({
    font = 'medium',
    onChange,
}: {
    font?: BoardFontSize
    onChange: () => void
}) {
    const { capture } = usePosthogTracking()

    return (
        <ChoiceChipGroupGeneral<BoardFontSize>
            label="Tekststørrelse"
            options={[
                { value: 'small', label: 'Liten' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Stor' },
            ]}
            defaultValue={font}
            name="font"
            ariaLabel="Tekststørrelse"
            onChange={(value) => {
                capture('board_settings_changed', {
                    setting: 'font',
                    value: value as 'small' | 'medium' | 'large',
                })
                onChange()
            }}
        />
    )
}

export { FontSelect }
