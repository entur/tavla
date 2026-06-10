'use client'
import { PrimaryButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph } from '@entur/typography'
import { useSaveDemoBoardInLocalStorage } from 'app/(admin)/hooks/useSaveDemoBoardInLocalStorage'
import { CreateUserButton } from 'app/components/CreateUserButton'
import { DemoPreview } from 'app/demo/components/DemoPreview'
import { publishBoard } from 'app/lag-tavle/actions'
import { CreateBoardSidebar } from 'app/lag-tavle/components/CreateBoardSidebar'
import { PublishModalContent } from 'app/lag-tavle/components/PublishBoardModal'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useCallback, useState } from 'react'

export type PublishBoardState =
    | { type: 'not-published' }
    | { type: 'publishing' }
    | { type: 'published'; boardId: string }
    | { type: 'error'; message: string }

function CreateBoardLocally() {
    const { board, loaded, setTiles, onSubmit } =
        useSaveDemoBoardInLocalStorage()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [publishState, setPublishState] = useState<PublishBoardState>({
        type: 'not-published',
    })

    const posthog = usePosthogTracking()

    const handlePublish = async () => {
        setPublishState({ type: 'publishing' })
        posthog.capture('board_share_selected')
        try {
            const boardId = await publishBoard(board)

            setPublishState({ type: 'published', boardId })
        } catch {
            setPublishState({
                type: 'error',
                message: 'Noe gikk galt. Prøv igjen.',
            })
        }
    }

    const resetPublishedBoard = useCallback(() => {
        setPublishState({ type: 'not-published' })
        setIsModalOpen(false)
    }, [])

    const handleSettingsSubmit = useCallback(
        async (data: FormData) => {
            await onSubmit(data)
            resetPublishedBoard()
        },
        [onSubmit, resetPublishedBoard],
    )

    return (
        <>
            <div className="flex h-full items-center justify-between align-middle">
                <Heading1 className="!mb-0">Lag en tavle</Heading1>

                <div className="flex flex-row gap-4">
                    <PublishButton
                        publishState={publishState}
                        onClick={() => setIsModalOpen(true)}
                    />
                    <CreateUserButton variant="secondary" />
                </div>
            </div>
            <LeadParagraph className="max-w-[1000px] mt-0">
                Søk opp din adresse eller ditt nærmeste stoppested og lag en
                tavle med avganger i nærheten. Når du er fornøyd med tavla kan
                du klikke på "Få lenke til tavla" og få en lenke du kan dele med
                andre, eller vise på en skjerm.
            </LeadParagraph>
            <div
                data-transport-palette={board.transportPalette}
                className="flex flex-col gap-6 lg:flex-row lg:items-start"
            >
                <section
                    data-theme={board.theme ?? 'dark'}
                    aria-label="Forhåndsvisning av Tavla"
                    className="min-w-0 flex-1 lg:sticky lg:top-8 lg:self-start"
                >
                    <DemoPreview board={board} />
                </section>

                {loaded && (
                    <aside className="w-full shrink-0 rounded-md bg-tintLight lg:w-[536px]">
                        <CreateBoardSidebar
                            board={board}
                            setTiles={setTiles}
                            onSettingsSubmit={handleSettingsSubmit}
                            resetPublishedBoard={resetPublishedBoard}
                        />
                    </aside>
                )}
            </div>
            <Modal
                size="medium"
                open={isModalOpen}
                onDismiss={() => {
                    posthog.capture('board_share_cancelled')
                    setIsModalOpen(false)
                }}
                title={getModalTitle(publishState)}
            >
                <div className="w-full">
                    <PublishModalContent
                        publishState={publishState}
                        handlePublish={handlePublish}
                        resetPublish={resetPublishedBoard}
                    />
                </div>
            </Modal>
        </>
    )
}

function getModalTitle(publishState: PublishBoardState) {
    switch (publishState.type) {
        case 'not-published':
            return 'Ferdig med tavla?'
        case 'published':
            return 'Din tavle er klar'
        case 'error':
            return 'Det skjedde en feil'
        default:
            return undefined
    }
}

function PublishButton({
    publishState,
    onClick,
}: {
    publishState: PublishBoardState
    onClick: () => void
}) {
    const posthog = usePosthogTracking()

    switch (publishState.type) {
        case 'error':
            return <div className="text-error">{publishState.message}</div>
        default:
            return (
                <PrimaryButton
                    onClick={() => {
                        onClick()
                        posthog.capture('board_share_started')
                    }}
                    loading={publishState.type === 'publishing'}
                    width="auto"
                >
                    Få lenke til tavla
                </PrimaryButton>
            )
    }
}

export { CreateBoardLocally }
