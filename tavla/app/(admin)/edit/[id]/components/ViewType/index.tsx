'use client'

import { Radio, RadioGroup } from '@entur/form'
import { Heading3, Paragraph } from '@entur/typography'
import { useState } from 'react'
import { TBoard } from 'types/settings'

function ViewTypeSetting({ board }: { board: TBoard }) {
    const [value, setValue] = useState(
        board.combinedTiles ? 'combined' : 'separate',
    )
    return (
        <div>
            <Heading3 margin="bottom">Visningstype</Heading3>
            <Paragraph>
                Velg om alle stoppestedene skal vises i hver sin tabell eller
                kombinert i samme tabell.
            </Paragraph>

            <div className="h-full mb-4">
                <RadioGroup
                    name="viewType"
                    label="Visningstype"
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                >
                    <Radio value="separate">Én liste per stoppested</Radio>
                    <Radio value="combined">Alle stoppesteder i én liste</Radio>
                </RadioGroup>
            </div>
        </div>
    )
}

export { ViewTypeSetting }
