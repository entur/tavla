'use client'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { Heading4 } from '@entur/typography'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import {
    TRACKING_DEBOUNCE_TIME,
    usePosthogTracking,
} from 'app/posthog/usePosthogTracking'
import { useRef, useState } from 'react'
import { BoardFooter } from 'src/types/db-types/boards'

function InfoMessage({
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
                    }, TRACKING_DEBOUNCE_TIME)

                    handleChange(f.target.value)
                }}
                onBlur={onBlur}
                label="Infomelding"
                name="infoMessage"
                className="w-full"
            />
        </div>
    )
}

export { InfoMessage }
