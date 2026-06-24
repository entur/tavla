'use client'

import { Paragraph } from '@entur/typography'
import { saveCustomUrl } from 'app/(innlogget)/tavler/[id]/rediger/actions'
import { Copy } from 'app/(innlogget)/tavler/[id]/rediger/components/Buttons/Copy'
import { validateCustomUrl } from 'app/(innlogget)/tavler/[id]/rediger/components/CustomUrl/utils'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useRef, useState, useTransition } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { resolveVisTavlaBaseUrl } from 'utils/boardLink'

function BoardLinkField({
    bid,
    customUrl,
}: {
    bid: BoardDB['id']
    customUrl?: string
}) {
    const { capture } = usePosthogTracking()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [value, setValue] = useState(customUrl ?? '')
    const [feedback, setFeedback] = useState<string | undefined>(undefined)
    const [, startTransition] = useTransition()

    const host = (
        resolveVisTavlaBaseUrl(
            typeof window !== 'undefined' ? window.location.host : undefined,
        ) ?? ''
    ).replace(/^https?:\/\//, '')

    const save = () => {
        const trimmed = value.trim()
        const validationError = validateCustomUrl(trimmed)
        if (validationError) {
            setFeedback(validationError)
            return
        }
        if (trimmed === (customUrl ?? '')) return
        startTransition(async () => {
            capture('custom_url_saved', { location: 'board_page' })
            const result = await saveCustomUrl(bid, trimmed)
            setFeedback(result.error)
        })
    }

    return (
        <>
            <div>
                <Paragraph margin="none">
                    <b>Original lenke:</b>
                </Paragraph>

                <Copy bid={bid} type="button" trackingLocation="board_page" />
                <Paragraph margin="none">
                    <b>Egen lenke:</b>
                </Paragraph>
            </div>
            <div className="flex items-center gap-1">
                <div className="font-mono rounded-lg p-1 flex flex-row items-center">
                    <Paragraph
                        margin="none"
                        className="whitespace-nowrap select-none"
                    >
                        {host}/
                    </Paragraph>
                    <input
                        className={`outline-none min-w-0 border rounded px-2 py-1 focus:ring-2 focus:ring-primary ${feedback ? 'border-red-500' : 'border-gray-300'}`}
                        value={value}
                        aria-label="Lenke til tavla"
                        onChange={(e) => {
                            setFeedback(
                                validateCustomUrl(e.target.value.trim()),
                            )
                            setValue(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') e.currentTarget.blur()
                        }}
                        onBlur={save}
                        ref={inputRef}
                    />
                </div>

                <Copy
                    bid={customUrl || bid}
                    type="icon"
                    trackingLocation="board_page"
                />
            </div>
        </>
    )
}

export { BoardLinkField }
