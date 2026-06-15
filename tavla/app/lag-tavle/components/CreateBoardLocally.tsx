'use client'
import { IconButton, PrimaryButton } from '@entur/button'
import { LeftArrowIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import {
    Heading1,
    Heading2,
    Heading3,
    Label,
    LeadParagraph,
} from '@entur/typography'
import { CreateUserButton } from 'app/_components/CreateUserButton'
import { TileList } from 'app/_components/TileList'
import { TileSelector } from 'app/_components/TileSelector/TileSelector'
import { formDataToTiles } from 'app/_components/TileSelector/utils'
import { useSaveBoardInLocalStorage } from 'app/_hooks/useSaveBoardInLocalStorage'
import { publishBoard } from 'app/lag-tavle/actions'
import { BoardPreview } from 'app/lag-tavle/components/BoardPreview'
import { CreateBoardSidebar } from 'app/lag-tavle/components/CreateBoardSidebar'
import { PublishModalContent } from 'app/lag-tavle/components/PublishBoardModal'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useCallback, useState } from 'react'

export type PublishBoardState =
    | { type: 'not-published' }
    | { type: 'publishing' }
    | { type: 'published'; boardId: string }
    | { type: 'error'; message: string }

export function CreateBoardLocally() {
    const { board, loaded, setTiles, onSubmit } = useSaveBoardInLocalStorage()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [publishState, setPublishState] = useState<PublishBoardState>({
        type: 'not-published',
    })

    const { capture } = usePosthogTracking()

    const handlePublish = async () => {
        setPublishState({ type: 'publishing' })
        capture('board_share_selected')
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

    const resetToChoice = useCallback(() => {
        setPublishState({ type: 'not-published' })
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
            <div className="flex h-full sm:items-center justify-between sm:align-middle flex-col sm:flex-row">
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
                    <BoardPreview board={board} />
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

                <Heading2 as="h2">{board.meta.title || 'Min tavle'}</Heading2>
                <Heading3>Hvilke stoppesteder vil du vise i tavlen?</Heading3>
                <div className="flex flex-col gap-4">
                    <TileSelector
                        action={async (data: FormData) => {
                            const tiles = formDataToTiles(data)
                            setTiles([...board.tiles, ...tiles])
                            resetPublishedBoard()
                        }}
                        trackingLocation="board_without_user"
                    />
                    <TileList
                        board={board}
                        setTilesLocalStorageBoard={(tiles) => {
                            setTiles(tiles)
                            resetPublishedBoard()
                        }}
                    />
                    <section
                        data-theme={board.theme ?? 'dark'}
                        aria-label="Forhåndsvisning av Tavla"
                    >
                        <BoardPreview board={board} />
                    </section>
                </div>
            </div>
            <Modal
                size="medium"
                open={isModalOpen}
                onDismiss={() => {
                    capture('board_share_cancelled')
                    setIsModalOpen(false)
                }}
                title={getModalTitle(publishState)}
            >
                {publishState.type === 'published' && (
                    <IconButton
                        aria-label="Tilbake"
                        onClick={resetToChoice}
                        className="absolute left-4 top-4 gap-2"
                    >
                        <LeftArrowIcon />
                        <Label as="span">Tilbake</Label>
                    </IconButton>
                )}
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
    const { capture } = usePosthogTracking()

    switch (publishState.type) {
        case 'error':
            return <div className="text-error">{publishState.message}</div>
        default:
            return (
                <PrimaryButton
                    onClick={() => {
                        onClick()
                        capture('board_share_started')
                    }}
                    loading={publishState.type === 'publishing'}
                    width="auto"
                >
                    Få lenke til tavla
                </PrimaryButton>
            )
    }
}
