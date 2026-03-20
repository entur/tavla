'use client'
import { CopyableText } from '@entur/alert'
import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button'
import { CloseIcon } from '@entur/icons'
import { LoadingDots } from '@entur/loader'
import { Modal } from '@entur/modal'
import { Heading2, Heading3, Label, Paragraph } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTiles } from 'app/(admin)/components/TileSelector/utils'
import { useSaveDemoBoardInLocalStorage } from 'app/(admin)/hooks/useSaveDemoBoardInLocalStorage'
import { SettingsForm } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/SettingsForm'
import { TileList } from 'app/(admin)/tavler/[id]/rediger/components/TileList'
import { CreateUserButton } from 'app/components/CreateUserButton'
import { DemoPreview } from 'app/demo/components/DemoPreview'
import { publishBoard } from 'app/lag-tavle/actions'
import rabbits from 'assets/illustrations/Rabbits.png'
import sheep from 'assets/illustrations/Sheep.png'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { getBoardLinkClient } from 'src/utils/boardLink'

type PublishBoardState =
    | { type: 'not-published' }
    | { type: 'publishing' }
    | { type: 'published'; boardId: string }
    | { type: 'error'; message: string }

function CreateBoardLocally() {
    const { board, setTiles, onSubmit } = useSaveDemoBoardInLocalStorage()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [publishState, setPublishState] = useState<PublishBoardState>({
        type: 'not-published',
    })

    const handlePublish = async () => {
        setPublishState({ type: 'publishing' })
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

    const resetPublishedBoard = () => {
        setPublishState({ type: 'not-published' })
        setIsModalOpen(false)
    }

    const handleSettingsSubmit = useCallback(
        async (data: FormData) => {
            await onSubmit(data)
            resetPublishedBoard()
        },
        [onSubmit],
    )

    return (
        <>
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
                <div
                    data-theme={board.theme ?? 'dark'}
                    aria-label="Forhåndsvisning av Tavla"
                >
                    <Heading2>Forhåndsvisning</Heading2>
                    <DemoPreview board={board} />
                </div>
            </div>
            <SettingsForm board={board} onSubmit={handleSettingsSubmit} />
            <div className="flex flex-col gap-4">
                {publishState.type !== 'published' && (
                    <PrimaryButton
                        onClick={() => setIsModalOpen(true)}
                        loading={publishState.type === 'publishing'}
                        width="auto"
                    >
                        Del tavla
                    </PrimaryButton>
                )}
                {publishState.type === 'published' && (
                    <CopyableText
                        successHeading=""
                        successMessage="Lenken til tavlen ble kopiert!"
                    >
                        {getBoardLinkClient(publishState.boardId)}
                    </CopyableText>
                )}
                {publishState.type === 'error' && (
                    <div className="text-error">{publishState.message}</div>
                )}
            </div>

            <Modal
                size="small"
                open={isModalOpen}
                onDismiss={() => setIsModalOpen(false)}
                title={
                    publishState.type === 'not-published'
                        ? 'Ferdig å redigere?'
                        : publishState.type === 'published'
                          ? 'Din tavle er klar'
                          : publishState.type === 'error'
                            ? 'Det skjedde en feil'
                            : undefined
                }
            >
                <IconButton
                    aria-label="Avbryt opprettelse av tavle"
                    onClick={() => {
                        /*posthog.capture('board_create_cancelled', {
                            method: 'close_icon',
                        })*/
                        setIsModalOpen(false)
                    }}
                    className="absolute right-4 top-4 flex flex-row gap-2"
                >
                    <CloseIcon />
                    <Label>Lukk</Label>
                </IconButton>
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

function PublishModalContent({
    publishState,
    handlePublish,
    resetPublish,
}: {
    publishState: PublishBoardState
    handlePublish: () => void
    resetPublish: () => void
}) {
    switch (publishState.type) {
        case 'not-published':
            return (
                <>
                    <Paragraph>
                        Hvis du deler uten å opprette en bruker så har du ikke
                        mulighet til å endre denne senere.
                        <br />
                        Gå tilbake hvis du vil gjøre flere endringer før du
                        deler, eller opprett en bruker for å kunne gjøre
                        endringer etter at du deler.
                    </Paragraph>
                    <div className="flex w-full flex-col gap-4">
                        <PrimaryButton onClick={handlePublish} width="fluid">
                            Del tavle
                        </PrimaryButton>
                        <div className="w-full rounded-sm border-2"></div>

                        <div className="flex flex-row gap-2">
                            <SecondaryButton
                                onClick={resetPublish}
                                width="fluid"
                            >
                                Gå tilbake
                            </SecondaryButton>
                            <CreateUserButton
                                variant="secondary"
                                width="fluid"
                            />
                        </div>
                    </div>
                </>
            )
        case 'publishing':
            return <LoadingDots />
        case 'published':
            return (
                <>
                    <Image
                        src={rabbits}
                        aria-hidden="true"
                        alt="Illustrasjon av sauer"
                        className="align-center h-1/2 w-1/2 justify-self-center"
                    />
                    <Paragraph>
                        Din tavle er nå publisert og klar til å deles! Kopier
                        lenken
                    </Paragraph>
                    <CopyableText
                        successHeading=""
                        successMessage="Lenken til tavlen ble kopiert!"
                    >
                        {getBoardLinkClient(publishState.boardId)}
                    </CopyableText>
                </>
            )
        case 'error':
            return (
                <div>
                    <Image
                        src={sheep}
                        aria-hidden="true"
                        alt="Illustrasjon av sauer"
                        className="align-center h-1/2 w-1/2 justify-self-center"
                    />
                    <Paragraph>
                        Det skjedde en feil ved publisering av tavlen.
                    </Paragraph>
                    <div className="flex w-full flex-row gap-2">
                        <SecondaryButton onClick={resetPublish} width="fluid">
                            Lukk
                        </SecondaryButton>
                        <PrimaryButton onClick={handlePublish} width="fluid">
                            Prøv igjen
                        </PrimaryButton>
                    </div>
                </div>
            )
    }
}

export { CreateBoardLocally }
