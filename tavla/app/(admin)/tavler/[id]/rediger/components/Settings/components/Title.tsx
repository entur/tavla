'use client'
import { Heading4 } from '@entur/typography'
import { TFormFeedback } from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useRef } from 'react'

function Title({
    title,
    feedback,
    onBlur,
}: {
    title: string
    feedback?: TFormFeedback
    onBlur: () => void
}) {
    const posthog = usePosthogTracking()
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    return (
        <div>
            <Heading4 margin="bottom">Navn</Heading4>
            <ClientOnlyTextField
                name="title"
                className="w-full"
                defaultValue={title}
                label="Navn på tavlen"
                maxLength={50}
                onBlur={onBlur}
                required
                aria-required
                autoComplete="off"
                onChange={() => {
                    if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current)
                    }

                    debounceTimerRef.current = setTimeout(() => {
                        posthog.capture('board_settings_changed', {
                            setting: 'title',
                            value: 'changed',
                        })
                    }, 500)
                }}
                {...feedback}
            />
        </div>
    )
}
export { Title }
