'use client'

import {
    ButtonGroup,
    IconButton,
    PrimaryButton,
    SecondaryButton,
} from '@entur/button'
import { EditIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3 } from '@entur/typography'
import ClientOnlyTextField from 'app/_components/NoSSR/TextField'
import { saveBoardTitle } from 'app/(innlogget)/tavler/[id]/rediger/actions'
import { isEmptyOrSpaces } from 'app/(innlogget)/tavler/[id]/utils'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState, useTransition } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'

function EditBoardName({ board }: { board: BoardDB }) {
    const { capture } = usePosthogTracking()

    const currentTitle = board.meta.title ?? ''

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(currentTitle)
    const [feedback, setFeedback] = useState<string | undefined>(undefined)
    const [isPending, startTransition] = useTransition()

    const openModal = () => {
        capture('board_name_edit_started', { location: 'board_page' })
        setValue(currentTitle)
        setFeedback(undefined)
        setOpen(true)
    }

    const closeModal = (method: 'dismissed' | 'cancel_button') => {
        capture('board_name_edit_cancelled', { location: 'board_page', method })
        setOpen(false)
    }

    const submit = () => {
        if (isEmptyOrSpaces(value)) {
            setFeedback('Tavla må ha et navn.')
            return
        }

        startTransition(async () => {
            capture('board_name_saved', { location: 'board_page' })
            const result = await saveBoardTitle(board.id, value)
            if (result.error) {
                setFeedback(result.error)
            } else {
                setOpen(false)
            }
        })
    }

    return (
        <>
            <IconButton
                aria-label="Endre navn på tavla"
                onClick={openModal}
                className="gap-2"
            >
                <EditIcon />
                Endre navn
            </IconButton>
            <Modal
                open={open}
                size="small"
                onDismiss={() => closeModal('dismissed')}
                closeLabel="Avbryt"
            >
                <Heading3 as="h1" margin="none">
                    Endre navn på Tavla
                </Heading3>
                <form
                    className="mt-6 flex flex-col"
                    aria-live="polite"
                    onSubmit={(e) => {
                        e.preventDefault()
                        submit()
                    }}
                >
                    <ClientOnlyTextField
                        label="Navn på tavla"
                        name="title"
                        value={value}
                        maxLength={50}
                        required
                        aria-required
                        onChange={(e) => {
                            setValue(e.target.value)
                            if (feedback) setFeedback(undefined)
                        }}
                        variant={feedback ? 'error' : undefined}
                        feedback={feedback}
                    />
                    <ButtonGroup className="mt-8 flex flex-row gap-4">
                        <SecondaryButton
                            type="button"
                            width="fluid"
                            className="!mr-0"
                            onClick={() => closeModal('cancel_button')}
                        >
                            Avbryt
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            width="fluid"
                            className="!mr-0"
                            loading={isPending}
                            disabled={isPending || isEmptyOrSpaces(value)}
                        >
                            Bekreft valg
                        </PrimaryButton>
                    </ButtonGroup>
                </form>
            </Modal>
        </>
    )
}

export { EditBoardName }
