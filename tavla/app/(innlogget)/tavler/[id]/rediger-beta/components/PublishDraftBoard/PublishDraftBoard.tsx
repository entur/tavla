'use client'
import { PrimaryButton } from '@entur/button'
import { BaseCard, Tag } from '@entur/layout'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { CreateUserButton } from 'app/_components/CreateUserButton'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { ForwardIcon, UserIcon } from 'node_modules/@entur/icons/dist'
import { startTransition, useActionState, useState } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { type PublishState, publishDraftBoard } from './actions'

export function PublishDraftBoard({ board }: { board: BoardDB }) {
    const { capture } = usePosthogTracking()
    const [open, setOpen] = useState(false)

    async function handlePublish(_prevState: PublishState) {
        const result = await publishDraftBoard(board.id)

        if (result?.status === 'success') {
            capture('draft_board_published', {
                location: 'edit_board_without_user',
            })
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
                <PrimaryButton
                    onClick={() => {
                        capture('draft_board_publish_started', {
                            location: 'edit_board_without_user',
                        })
                        setOpen(true)
                    }}
                >
                    Få lenke til tavla
                </PrimaryButton>
            </div>
            <Modal
                open={open}
                size="medium"
                onDismiss={() => {
                    capture('draft_board_publish_cancelled', {
                        location: 'edit_board_without_user',
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
