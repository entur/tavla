'use client'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { Heading4 } from '@entur/typography'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useState } from 'react'
import { TFooter } from 'types/settings'

function Footer({
    infoMessage,
    onBlur,
}: {
    infoMessage?: TFooter
    onBlur: () => void
}) {
    const [selectedValue, setSelectedValue] = useState<string>(
        infoMessage?.footer ?? '',
    )
    const handleChange = (value: string) => {
        setSelectedValue(value)
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                <div className="flex flex-row items-center gap-2">
                    <Heading4 margin="bottom">Infomelding</Heading4>

                    <Tooltip
                        content="Skriv en kort tekst som skal vises nederst i tavlen."
                        placement="top"
                        id="tooltip-info-message"
                    >
                        <ValidationInfoFilledIcon
                            size={20}
                            aria-labelledby="tooltip-info-message"
                        />
                    </Tooltip>
                </div>
            </div>
            <ClientOnlyTextField
                value={selectedValue}
                onChange={(f) => handleChange(f.target.value as string)}
                onBlur={onBlur}
                label="Infomelding"
                name="footer"
                className="w-full"
                clearable
                onClear={() => setSelectedValue('')}
            />
            <HiddenInput id="infoMessage" value={selectedValue} />
        </div>
    )
}

export { Footer }
