'use client'
import { Heading4 } from '@entur/typography'
import { TFontSize } from 'types/meta'
import { TBoardID } from 'types/settings'
import { FontChoiceChip } from './FontChoiceChip'
import { ReactElement } from 'react'

function FontSelect({
    font,
    error,
}: {
    bid: TBoardID
    font: TFontSize
    error?: ReactElement
}) {
    return (
        <div className=" flex flex-col justify-between">
            <Heading4 margin="bottom">Tekststørrelse </Heading4>
            <FontChoiceChip font={font} />
            <div className="mt-4">{error}</div>
        </div>
    )
}

export { FontSelect }
