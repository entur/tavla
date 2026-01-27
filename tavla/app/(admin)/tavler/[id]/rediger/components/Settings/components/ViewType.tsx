'use client'

import { Radio, RadioGroup } from '@entur/form'
import { Heading4, Paragraph } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'

function ViewType({
    hasCombinedTiles,
    onChange,
}: {
    hasCombinedTiles: boolean
    onChange: () => void
}) {
    const posthog = usePosthogTracking()
    const [value, setValue] = useState(
        hasCombinedTiles ? 'combined' : 'separate',
    )

    return (
        <div>
            <Heading4 margin="bottom">Visningstype</Heading4>
            <Paragraph margin="none">
                Velg om alle stoppestedene skal vises i hver sin liste eller
                kombinert i samme liste.
            </Paragraph>

            <div className="mb-2">
                <RadioGroup
                    name="viewType"
                    onChange={(e) => {
                        posthog.capture('board_settings_changed', {
                            setting: 'view_type',
                            value: e.target.value as 'combined' | 'separate',
                        })
                        setValue(e.target.value)
                        onChange()
                    }}
                    value={value}
                >
                    <Radio value="separate">Én liste per stoppested</Radio>
                    <Radio value="combined">Alle stoppesteder i én liste</Radio>
                </RadioGroup>
            </div>
        </div>
    )
}

export { ViewType }
