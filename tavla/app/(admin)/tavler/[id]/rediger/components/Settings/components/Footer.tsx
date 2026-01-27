'use client'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { Heading4 } from '@entur/typography'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useRef, useState } from 'react'
import { BoardFooter } from 'src/types/db-types/boards'

function Footer({
    infoMessage,
    onBlur,
}: {
    infoMessage?: BoardFooter
    onBlur: () => void
}) {
    const posthog = usePosthogTracking()
    const [selectedValue, setSelectedValue] = useState<string>(
        infoMessage?.footer ?? '',
    )
    const handleChange = (value: string) => {
        setSelectedValue(value)
    }

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

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
                onChange={(f) => {
                    if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current)
                    }

                    debounceTimerRef.current = setTimeout(() => {
                        posthog.capture('board_settings_changed', {
                            setting: 'info_message',
                            value: 'changed',
                        })
                    }, 500)

                    handleChange(f.target.value)
                }}
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
