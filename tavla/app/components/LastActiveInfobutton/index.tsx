'use client'

import { IconButton } from '@entur/button'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { fontSizes } from '@entur/tokens'
import { Tooltip } from '@entur/tooltip'
import { useState } from 'react'

export const LastActiveInfobutton = () => {
    const [isOpen, setOpen] = useState(false)

    return (
        <Tooltip
            content="Viser når tavlen sist var i bruk. Dette gjelder kun aktivitet etter 15. januar 2026."
            placement="top"
            isOpen={isOpen}
        >
            <IconButton
                type="button"
                onClick={() => setOpen(!isOpen)}
                onBlur={() => setOpen(false)}
                aria-label="Informasjon om når tavlen sist var i bruk"
            >
                <ValidationInfoFilledIcon size={fontSizes.extraLarge} />
            </IconButton>
        </Tooltip>
    )
}
