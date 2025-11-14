'use client'

import { Radio, RadioGroup } from '@entur/form'
import { Heading4, Paragraph } from '@entur/typography'
import posthog from 'posthog-js'
import { useState } from 'react'

function ViewType({
    hasCombinedTiles,
    onChange,
}: {
    hasCombinedTiles: boolean
    onChange: () => void
}) {
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
                        setValue(e.target.value)
                        onChange()
                        posthog.capture('SAVE_VIEW_TYPE_BTN', {
                            value: e.target.value,
                        })
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
