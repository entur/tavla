'use client'

import { IconButton, PrimaryButton } from '@entur/button'

import { EditIcon, ValidationInfoFilledIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Tooltip } from '@entur/tooltip'
import { Heading3, Paragraph } from '@entur/typography'
import { useRef, useState, useTransition } from 'react'
import type { BoardDB } from 'types/db-types/boards'
import { resolveVisTavlaBaseUrl } from 'utils/boardLink'
import {
    TRACKING_DEBOUNCE_TIME,
    usePosthogTracking,
} from '../../../../../../posthog/usePosthogTracking'
import { saveCustomUrl } from '../../actions'

function CustomUrl({
    bid,
    customUrl,
}: {
    bid: BoardDB['id']
    customUrl?: string
}) {
    const posthog = usePosthogTracking()

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(customUrl ?? '')
    const [feedback, setFeedback] = useState<string | undefined>(undefined)
    const [_isPending, startTransition] = useTransition()
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    const handleChange = (newValue: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
            posthog.capture('custom_url_modified', { location: 'board_page' })
        }, TRACKING_DEBOUNCE_TIME)

        if (newValue && !/^[a-zA-Z0-9_-]*$/.test(newValue)) {
            setFeedback(
                'Du kan kun bruke bokstaver (ikke æ, ø og å), tall, bindestrek og understrek.',
            )
        } else {
            setFeedback(undefined)
        }

        setValue(newValue)
    }

    const baseUrl = resolveVisTavlaBaseUrl()

    const submit = () => {
        startTransition(async () => {
            posthog.capture('custom_url_saved', { location: 'board_page' })
            const result = await saveCustomUrl(bid, value)
            if (result.error) {
                setFeedback(result.error)
            } else {
                setOpen(false)
            }
        })
    }

    return (
        <>
            <Tooltip
                content="Rediger lenken til tavla"
                placement="bottom"
                id="tooltip-edit-url-board"
            >
                <IconButton
                    aria-label="Rediger lenken til tavla"
                    onClick={() => {
                        posthog.capture('custom_url_modal_opened', {
                            location: 'board_page',
                        })
                        setOpen(true)
                    }}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>
            {open && (
                <Modal
                    size="medium"
                    onDismiss={() => {
                        posthog.capture('custom_url_modal_closed', {
                            location: 'board_page',
                        })
                        setOpen(false)
                    }}
                >
                    <div className="flex flex-col w-full mb-4">
                        <Heading3 margin="bottom">Legg til egen lenke</Heading3>
                        <Paragraph>
                            Du kan selv velge en lenke til denne tavla. Det gjør
                            det enklere å huske, dele og skrive inn lenken til
                            tavla der den skal bli vist. Den originale lenken
                            vil fortsette å fungere selv om du legger til en
                            egen lenke.
                        </Paragraph>
                        <Paragraph margin="none">
                            <b>Original lenke:</b>
                        </Paragraph>
                        <Paragraph className="whitespace-nowrap">
                            {baseUrl}/{bid}
                        </Paragraph>
                        <Paragraph margin="none">
                            <b>Egen lenke til denne tavla:</b>
                        </Paragraph>
                        <div className="font-mono rounded-lg p-1 flex flex-row items-center">
                            <Paragraph
                                margin="none"
                                className="whitespace-nowrap select-none"
                            >
                                {baseUrl}/
                            </Paragraph>
                            <input
                                className={`outline-none min-w-0 border rounded px-2 py-1 focus:ring-2 focus:ring-primary ${feedback ? 'border-red-500' : 'border-gray-300'}`}
                                value={value}
                                aria-label="Egendefinert lenke"
                                onChange={(f) => handleChange(f.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !feedback) {
                                        submit()
                                    }
                                }}
                            />
                        </div>
                        {feedback && (
                            <Paragraph
                                margin="none"
                                className="flex gap-2 text-red-600 text-sm"
                            >
                                <ValidationInfoFilledIcon />
                                {feedback}
                            </Paragraph>
                        )}
                    </div>
                    <PrimaryButton disabled={!!feedback} onClick={submit}>
                        Lagre og lukk
                    </PrimaryButton>
                </Modal>
            )}
        </>
    )
}

export { CustomUrl }
