'use client'
import { CopyableText } from '@entur/alert'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { CopyIcon, ExternalIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState, useState } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'
import { type PublishState, publishDraftBoard } from './actions'

export function PublishDraftBoard({ board }: { board: BoardDB }) {
    const { capture } = usePosthogTracking()
    const [open, setOpen] = useState(false)
    const boardLink = getBoardLinkClient(board.customUrl ?? board.id)

    async function handlePublish(_prevState: PublishState) {
        const result = await publishDraftBoard(board.id)

        if (result?.status === 'success') {
            capture('draft_board_published', { location: 'edit_board_page' })
        }

        return result
    }

    const [state, action, isPending] = useActionState(handlePublish, null)

    const error = state?.status === 'error' ? state.message : undefined
    // Dekker både "nettopp publisert i denne økten" (lokal state, overlever
    // fordi denne komponenten aldri byttes ut når isDraft endrer seg — se
    // EditBoardBeta, som rendrer PublishDraftBoard basert på
    // isAnonymousBoard, ikke isDraft) og "besøker et allerede publisert
    // board på nytt" (server-tilstand).
    const published = state?.status === 'success' || !board.isDraft

    function copyLink() {
        capture('board_copied', { location: 'board_without_user' })
        navigator.clipboard.writeText(boardLink)
    }

    function openBoard() {
        capture('board_opened', { location: 'board_without_user' })
        window.open(boardLink, '_blank')
    }

    return (
        <div className="sticky bottom-0 z-10 w-screen ml-[calc(50%-50vw)] bg-background py-4 shadow-[0_-1px_6px_-1px_rgba(0,0,0,0.1)]">
            {published ? (
                <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="flex-shrink-0">Lenke til tavla:</span>
                        <CopyableText
                            className="m-0 min-w-0 flex-1 p-0"
                            size="small"
                        >
                            {boardLink}
                        </CopyableText>
                    </div>
                    <PrimaryButton onClick={openBoard}>
                        Åpne tavla
                        <ExternalIcon />
                    </PrimaryButton>
                </div>
            ) : (
                <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Paragraph margin="none">
                        Fornøyd med tavla? Fullfør for å få en lenke du kan dele
                        eller vise på en skjerm.
                    </Paragraph>
                    <PrimaryButton
                        onClick={() => {
                            capture('draft_board_publish_started', {
                                location: 'edit_board_page',
                            })
                            setOpen(true)
                        }}
                    >
                        Få lenke til tavla
                    </PrimaryButton>
                </div>
            )}
            <Modal
                open={open}
                size="small"
                onDismiss={() => setOpen(false)}
                closeLabel={published ? 'Lukk' : 'Avbryt'}
                title={published ? 'Din tavle er klar' : 'Få lenke til tavla'}
            >
                {published ? (
                    <div className="mt-4 flex flex-col gap-4">
                        <Paragraph margin="none">
                            Din tavle er nå klar! Kopier lenken og del den med
                            andre, eller vis den på en skjerm. Du kan ikke
                            lenger redigere tavla her uten å logge inn.
                        </Paragraph>
                        <CopyableText
                            successHeading=""
                            successMessage="Lenken til tavla ble kopiert!"
                            onClick={copyLink}
                        >
                            {boardLink}
                        </CopyableText>
                        <div className="flex flex-row gap-2">
                            <PrimaryButton onClick={copyLink} width="fluid">
                                Kopier lenke
                                <CopyIcon />
                            </PrimaryButton>
                            <PrimaryButton onClick={openBoard} width="fluid">
                                Åpne tavla
                                <ExternalIcon />
                            </PrimaryButton>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 flex flex-col gap-4">
                        <Paragraph margin="none">
                            Når du har fått lenken kan du ikke lenger redigere
                            denne tavla her uten å logge inn.
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
                )}
            </Modal>
        </div>
    )
}
