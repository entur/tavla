'use client'

import { FilterChip } from '@entur/chip'
import { Heading4, Paragraph } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'

export type Elements = 'clock' | 'logo'

function ElementSelect({
    selectedElements = [],
    onChange,
}: {
    selectedElements?: Elements[]
    onChange: () => void
}) {
    const posthog = usePosthogTracking()

    return (
        <div className="flex flex-col gap-1">
            <Heading4 margin="bottom">Vis elementer</Heading4>
            <Paragraph margin="none">
                Velg hvilke elementer som skal vises i øverst på tavla.
            </Paragraph>
            <div className="mb-2 flex h-full flex-row gap-3">
                <FilterChip
                    name="clock"
                    value="clock"
                    onChange={() => {
                        posthog.capture('board_settings_changed', {
                            setting: 'element_select',
                            value: 'clock',
                        })
                        onChange()
                    }}
                    defaultChecked={selectedElements.includes('clock')}
                >
                    Klokke
                </FilterChip>
                <FilterChip
                    name="logo"
                    value="logo"
                    onChange={() => {
                        posthog.capture('board_settings_changed', {
                            setting: 'element_select',
                            value: 'logo',
                        })
                        onChange()
                    }}
                    defaultChecked={selectedElements.includes('logo')}
                >
                    Logo
                </FilterChip>
            </div>
        </div>
    )
}

export { ElementSelect }
