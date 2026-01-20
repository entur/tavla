'use client'

import { ValidationInfoFilledIcon } from '@entur/icons'
import { fontSizes } from '@entur/tokens'
import { Tooltip } from '@entur/tooltip'

export const LastActiveInfobutton = () => {
    return (
        <>
            <Tooltip
                content="Viser når tavlen sist var i bruk. Dette gjelder kun aktivitet
                etter 15. januar 2026."
                placement="top"
            >
                <ValidationInfoFilledIcon size={fontSizes.extraLarge} />
            </Tooltip>
        </>
    )
}
