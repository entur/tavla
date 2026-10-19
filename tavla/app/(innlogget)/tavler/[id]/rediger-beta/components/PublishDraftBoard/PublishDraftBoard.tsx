'use client'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState, useState } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { type PublishState, publishDraftBoard } from './actions'

export function PublishDraftBoard({ board }: { board: BoardDB }) {
    const { capture } = usePosthogTracking()
    const [open, setOpen] = useState(false)

    async function handlePublish(_prevState: PublishState) {
        const result = await publishDraftBoard(board.id)

        if (result?.status === 'success') {
            capture('draft_board_published', { location: 'edit_board_page' })
            setOpen(false)
        }

        return result
    }

    const [state, action, isPending] = useActionState(handlePublish, null)

    const error = state?.status === 'error' ? state.message : undefined

    return (
        <div className="sticky bottom-0 z-10 w-screen ml-[calc(50%-50vw)] bg-background py-4 shadow-[0_-1px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Paragraph margin="none">
                    Fornøyd med tavla? Fullfør for å få en lenke du kan dele
                    eller vise på en skjerm.
                </Paragraph>
                <PrimaryButton onClick={() => setOpen(true)}>
                    Få lenke til tavla
                </PrimaryButton>
            </div>
            <Modal
                open={open}
                size="small"
                onDismiss={() => setOpen(false)}
                closeLabel="Avbryt"
                title="Få lenke til tavla"
            >
                <div className="mt-4 flex flex-col gap-4">
                    <Paragraph margin="none">
                        Når du har fått lenken kan du ikke lenger redigere denne
                        tavla her uten å logge inn.
                    </Paragraph>
                    {error && (
                        <Paragraph margin="none" className="text-negative">
                            {error}
                        </Paragraph>
                    )}
                    <div className="flex flex-row gap-4">
                        <SecondaryButton
                            width="fluid"
                            onClick={() => setOpen(false)}
                        >
                            Avbryt
                        </SecondaryButton>
                        <PrimaryButton
                            width="fluid"
                            disabled={isPending}
                            onClick={() => startTransition(() => action())}
                        >
                            Bekreft
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
