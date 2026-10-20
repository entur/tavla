'use client'
import { PrimaryButton } from '@entur/button'
import { ForwardIcon, UserIcon } from '@entur/icons'
import { BaseCard, Tag } from '@entur/layout'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { CreateUserButton } from 'app/_components/CreateUserButton'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { CopyableText } from 'node_modules/@entur/alert'
import { startTransition, useActionState, useState } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'
import { ContactFormButton } from './ContactFormButton'
import { CustomUrl } from './CustomUrl/CustomUrl'
import { OpenBoard } from './OpenBoard'
import {
    type PublishState,
    publishDraftBoard,
} from './PublishDraftBoard/actions'
import { RefreshBoard } from './RefreshBoard/RefreshBoard'

export function BoardLinkActions({ board }: { board: BoardDB }) {
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

    const isUnpublishedDraft = board.isAnonymousBoard && board.isDraft

    return (
        <div className="sticky bottom-0 z-10 w-screen ml-[calc(50%-50vw)] bg-background py-4 shadow-[0_-1px_6px_-1px_rgba(0,0,0,0.1)]">
            {isUnpublishedDraft ? (
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
            ) : (
                <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-end sm:items-center gap-2">
                        <div className="flex min-w-0 flex-1 justify-start w-full gap-2 sm:items-center flex-col sm:flex-row">
                            <span className="flex-shrink-0">
                                Lenke til tavla:
                            </span>
                            <CopyableText
                                className="p-0 m-0 min-w-0 flex-1"
                                size="small"
                            >
                                {boardLink}
                            </CopyableText>
                        </div>
                        <CustomUrl bid={board.id} customUrl={board.customUrl} />
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <RefreshBoard board={board} />
                        <OpenBoard board={board} />
                        <ContactFormButton />
                    </div>
                </div>
            )}

            <Modal
                open={open}
                size="medium"
                onDismiss={() => {
                    capture('draft_board_publish_cancelled', {
                        location: 'edit_board_page',
                    })
                    setOpen(false)
                }}
                closeLabel="Lukk"
                title="Ferdig med tavla?"
            >
                <div className="flex flex-col gap-8">
                    <Paragraph margin="none">
                        Velg hvordan du vil gå videre
                    </Paragraph>
                    {error && (
                        <Paragraph margin="none" className="text-negative">
                            {error}
                        </Paragraph>
                    )}
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <BaseCard className="flex flex-1 flex-col justify-between gap-4 px-8 pb-8 pt-8">
                            <div className="flex flex-col">
                                <Tag variant="peach">
                                    For deg som kun skal lage én tavle
                                </Tag>
                                <Heading3 as="h3">Få lenke til tavla</Heading3>
                                <Paragraph>
                                    Du får en lenke til tavla med én gang. Du
                                    kan ikke redigere denne tavla videre her
                                    etter dette.
                                </Paragraph>
                            </div>
                            <PrimaryButton
                                width="fluid"
                                disabled={isPending}
                                onClick={() => startTransition(() => action())}
                            >
                                Få lenke til tavla
                                <ForwardIcon />
                            </PrimaryButton>
                        </BaseCard>
                        <BaseCard className="flex flex-1 flex-col justify-between gap-4 px-8 pb-8 pt-8">
                            <div className="flex flex-col">
                                <Tag variant="blue">
                                    Flere valg og mer fleksibelt
                                </Tag>
                                <Heading3 as="h3">
                                    Opprett bruker og lagre tavla
                                </Heading3>
                                <Paragraph>
                                    Med bruker kan du fortsette å redigere denne
                                    tavla når som helst, og endringene vises
                                    automatisk på den samme lenken.
                                </Paragraph>
                            </div>
                            <CreateUserButton
                                variant="primary"
                                width="fluid"
                                claimBoard={board.id}
                            >
                                Opprett bruker
                                <UserIcon />
                            </CreateUserButton>
                        </BaseCard>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
