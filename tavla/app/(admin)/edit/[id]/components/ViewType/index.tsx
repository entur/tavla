'use client'

import { RadioGroup, Radio } from '@entur/form'
import { Heading3, Paragraph } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useState } from 'react'
import { TBoard } from 'types/settings'
import { setViewType as setViewTypeAction } from './actions'
import { useToast } from '@entur/alert'
import { usePostHog } from 'posthog-js/react'

function ViewTypeSetting({ board }: { board: TBoard }) {
    const [value, setValue] = useState(
        board.combinedTiles ? 'combined' : 'separate',
    )
    const { addToast } = useToast()
    const posthog = usePostHog()

    const setViewType = async () => {
        const formFeedback = await setViewTypeAction(board, value)
        if (!formFeedback) {
            addToast('Visningstype lagret!')
        }
    }
    return (
        <form action={setViewType} className="box flex flex-col">
            <Heading3 margin="bottom">Visningstype</Heading3>
            <Paragraph>
                Velg om alle stoppestedene skal vises i hver sin tabell eller
                kombinert i samme tabell.
            </Paragraph>

            <div className="h-full">
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
            <div className="flex flex-row mt-8 justify-end">
                <SubmitButton
                    variant="secondary"
                    aria-label="Lagre visningstype"
                    className="max-sm:w-full"
                    onClick={() => posthog.capture('SAVE_VIEW_TYPE_BTN')}
                >
                    Lagre visningstype
                </SubmitButton>
            </div>
        </form>
    )
}
export { ViewTypeSetting }
