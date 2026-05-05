'use client'
import { PrimaryButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading1, Heading2, Heading3, LeadParagraph } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTiles } from 'app/(admin)/components/TileSelector/utils'
import { useSaveDemoBoardInLocalStorage } from 'app/(admin)/hooks/useSaveDemoBoardInLocalStorage'
import { SettingsForm } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/SettingsForm'
import { TileList } from 'app/(admin)/tavler/[id]/rediger/components/TileList'
import { CreateUserButton } from 'app/components/CreateUserButton'
import { DemoPreview } from 'app/demo/components/DemoPreview'
import { publishBoard } from 'app/lag-tavle/actions'
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
                className="flex flex-col gap-4 rounded-md bg-tintLight px-6 py-8"
            >
                <Heading3 as="h2" margin="top">
                    Hvilke stoppesteder vil du vise i tavlen?
                </Heading3>
                <TileSelector
                    action={async (data: FormData) => {
                        const tiles = formDataToTiles(data)
                        setTiles([...board.tiles, ...tiles])
                        resetPublishedBoard()
                    }}
                    trackingLocation="demo_page"
                />
                <TileList
                    board={board}
                    setTilesDemoBoard={setTiles}
                    bid="demo"
                />
                <section
                    data-theme={board.theme ?? 'dark'}
                    aria-label="Forhåndsvisning av Tavla"
                >
                    <Heading2>Forhåndsvisning</Heading2>
                    <DemoPreview board={board} />
                </section>
            </div>
            {loaded && (
                <SettingsForm board={board} onSubmit={handleSettingsSubmit} />
            )}
            <PublishButton
                publishState={publishState}
                onClick={() => setIsModalOpen(true)}
            />
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
