'use client'
import { Heading4 } from '@entur/typography'
import { TFontSize } from 'types/meta'
import { TBoardID } from 'types/settings'
import { FontChoiceChip } from './FontChoiceChip'

function FontSelect({ font }: { bid: TBoardID; font: TFontSize }) {
    return (
        <div>
            <Heading4 margin="bottom">Tekststørrelse </Heading4>
            <FontChoiceChip font={font} />
        </div>
    )
}

export { FontSelect }
