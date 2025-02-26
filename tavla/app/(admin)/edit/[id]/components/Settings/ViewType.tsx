'use client'

import { Radio, RadioGroup } from '@entur/form'
import { Heading4, Paragraph } from '@entur/typography'
import { useState } from 'react'
import { TBoard } from 'types/settings'

function ViewTypeSetting({ board }: { board: TBoard }) {
    const [value, setValue] = useState(
        board.combinedTiles ? 'combined' : 'separate',
    )
    return (
        <div>
            <Heading4 margin="bottom">Visningstype</Heading4>
            <Paragraph margin="none">
                Velg om alle stoppestedene skal vises i hver sin tabell eller
                kombinert i samme tabell.
            </Paragraph>

            <div className="mb-2">
                <RadioGroup
                    name="viewType"
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
