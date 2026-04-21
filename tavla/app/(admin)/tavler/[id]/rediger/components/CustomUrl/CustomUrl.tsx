'use client'

import { IconButton, PrimaryButton } from '@entur/button'
import { EditIcon, ValidationInfoFilledIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Tooltip } from '@entur/tooltip'
import {
    Heading3,
    Heading4,
    ListItem,
    Paragraph,
    UnorderedList,
} from '@entur/typography'
import { Span } from 'next/dist/server/lib/trace/tracer'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useRef, useState, useTransition } from 'react'
import type { BoardDB } from 'types/db-types/boards'
import { resolveVisTavlaBaseUrl } from 'utils/boardLink'
import { FeatureFlags } from '../../../../../../posthog/featureFlags'
import { usePosthogTracking } from '../../../../../../posthog/usePosthogTracking'
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

    const handleChange = (newValue: string) => {
        newValue = newValue.replace(/ /g, '-')
        if (newValue && !/^[a-zA-Z0-9_-]*$/.test(newValue)) {
            setFeedback(
                'Lenken kan kun inneholde bokstaver, tall, bindestrek og understrek.',
            )
        } else {
            setFeedback(undefined)
        }

        setValue(newValue)

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
            posthog.capture('board_settings_changed', {
                setting: 'custom_link',
                value: 'changed',
            })
        }, 3000)
    }

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    const isUseCustomUrlEnabled =
        useFeatureFlagEnabled(FeatureFlags.CustomURL) || true

    const baseUrl = resolveVisTavlaBaseUrl(window.location.host)

    return (
        isUseCustomUrlEnabled &&
        (open ? (
            <Modal size="medium" onDismiss={() => setOpen(false)}>
                <div className="flex flex-col w-full mb-4">
                    <Heading3 margin="bottom">
                        Lag en egendefinert lenke
                    </Heading3>
                    <Paragraph>
                        Du kan selv velge en lenke til denne tavla. Det gjør det
                        enklere å huske, dele og skrive inn lenken til tavla der
                        den skal bli vist. Etter du har valgt en lenke under,
                        vil den nye lenken vises på siden for tavla.
                    </Paragraph>
                    <Paragraph margin="none">
                        <b>Viktig informasjon om egendefinerte lenker:</b>
                    </Paragraph>
                    <UnorderedList>
                        <ListItem>
                            Tavla er offentlig tilgjengelig for alle med lenken.
                        </ListItem>
                        <ListItem>
                            Lenken kan kun inneholder bokstaver (ikke æ, ø og
                            å), tall, bindestrek og understrek.
                        </ListItem>
                        <ListItem>
                            Lenken må være unik. Du vil få beskjed om lenken er
                            allerede tatt.
                        </ListItem>
                        <ListItem>
                            Hvis tavla allerede vises med den originale lenken,
                            vil denne fortsette å fungere hvis du endrer lenken.
                            NB! Egendefinerte lenker slutter å fungere hvis du
                            endrer lenken igjen. Da må du bruke den nyeste
                            egendefinerte lenken.
                        </ListItem>
                        <ListItem>
                            Du kan fjerne egendefinerte lenker ved å tømme
                            feltet under. Da vil kun den originale lenken
                            fungere.
                        </ListItem>
                    </UnorderedList>
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
                            placeholder={bid}
                            onChange={(f) => handleChange(f.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !feedback) {
                                    startTransition(async () => {
                                        const result = await saveCustomUrl(
                                            bid,
                                            value,
                                        )
                                        if (result.error) {
                                            setFeedback(result.error)
                                        } else {
                                            setOpen(false)
                                        }
                                    })
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
                <PrimaryButton
                    disabled={!!feedback}
                    onClick={() => {
                        saveCustomUrl(bid, value).then(() => setOpen(false))
                    }}
                >
                    Lagre og lukk
                </PrimaryButton>
            </Modal>
        ) : (
            <Tooltip
                content="Rediger lenken til tavla"
                placement="bottom"
                id="tooltip-copy-link-board"
            >
                <IconButton
                    aria-label="Rediger lenken til tavla"
                    onClick={() => {
                        setOpen(true)
                    }}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>
        ))
    )
}

export { CustomUrl }
