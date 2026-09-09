'use client'

import { ButtonGroup, IconButton, SecondaryButton } from '@entur/button'

import { EditIcon, ValidationInfoFilledIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Tooltip } from '@entur/tooltip'
import { Heading3, Paragraph } from '@entur/typography'
import { SubmitButton } from 'app/_components/Form/SubmitButton'
import {
    TRACKING_DEBOUNCE_TIME,
    usePosthogTracking,
} from 'app/posthog/usePosthogTracking'
import { useActionState, useRef, useState } from 'react'
import type { BoardDB } from 'types/db-types/boards'
import { resolveVisTavlaBaseUrl } from 'utils/boardLink'
import { type FormState, saveCustomUrl } from './actions'
import { validateCustomUrl } from './validation'

function CustomUrl({
    bid,
    customUrl,
}: {
    bid: BoardDB['id']
    customUrl?: string
}) {
    const { capture } = usePosthogTracking()

    const [open, setOpen] = useState(false)
    const [feedback, setFeedback] = useState<string | undefined>(undefined)
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    const handleChange = (newValue: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
            capture('custom_url_modified', { location: 'edit_board_page' })
        }, TRACKING_DEBOUNCE_TIME)

        setFeedback(validateCustomUrl(newValue))
    }

    const baseUrl = resolveVisTavlaBaseUrl()

    async function handleSave(_prevState: FormState, formData: FormData) {
        const result = await saveCustomUrl(bid, _prevState, formData)
        if (result?.status === 'success') {
            capture('custom_url_saved', { location: 'edit_board_page' })
            setOpen(false)
        } else if (result?.status === 'error') {
            setFeedback(result.message)
        }
        return result
    }

    const [_state, formAction, isPending] = useActionState(handleSave, null)

    const closeModal = () => {
        capture('custom_url_modal_closed', { location: 'edit_board_page' })
        setFeedback(undefined)
        setOpen(false)
    }

    return (
        <>
            <Tooltip
                content="Rediger lenken til tavla"
                placement="bottom"
                id="tooltip-edit-url-board-beta"
            >
                <IconButton
                    aria-label="Rediger lenken til tavla"
                    onClick={() => {
                        capture('custom_url_modal_opened', {
                            location: 'edit_board_page',
                        })
                        setOpen(true)
                    }}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>
            {open && (
                <Modal open={open} size="small" onDismiss={closeModal}>
                    <form action={formAction}>
                        <div className="flex flex-col w-full mb-4">
                            <Heading3 margin="bottom">
                                Legg til egen lenke
                            </Heading3>
                            <Paragraph>
                                Du kan selv velge en lenke til denne tavla. Den
                                originale lenken vil fortsette å fungere selv om
                                du legger til en egen lenke.
                            </Paragraph>
                            <Paragraph margin="none">
                                <b>Original lenke:</b>
                            </Paragraph>
                            <Paragraph className="break-all">
                                {baseUrl}/{bid}
                            </Paragraph>
                            <Paragraph margin="none">
                                <b>Egen lenke til denne tavla:</b>
                            </Paragraph>
                            <div className="rounded-lg p-1 flex flex-row items-center">
                                <Paragraph
                                    margin="none"
                                    className="shrink-0 select-none"
                                >
                                    {baseUrl}/
                                </Paragraph>
                                <input
                                    name="customUrl"
                                    className={`outline-none min-w-0 border rounded px-2 py-1 pl-0.5 focus:ring-2 focus:ring-primary ${feedback ? 'border-red-500' : 'border-gray-300'}`}
                                    defaultValue={customUrl}
                                    aria-label="Egendefinert lenke"
                                    onChange={(f) =>
                                        handleChange(f.target.value)
                                    }
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
                        <ButtonGroup className="mt-8 flex flex-row gap-4">
                            <SecondaryButton
                                type="button"
                                width="fluid"
                                onClick={closeModal}
                            >
                                Avbryt
                            </SecondaryButton>
                            <SubmitButton
                                variant="primary"
                                width="fluid"
                                disabled={isPending || !!feedback}
                            >
                                Lagre
                            </SubmitButton>
                        </ButtonGroup>
                    </form>
                </Modal>
            )}
        </>
    )
}

export { CustomUrl }
