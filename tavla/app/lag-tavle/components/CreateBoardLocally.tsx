'use client'
import { CopyableText } from '@entur/alert'
import { ButtonGroup, PrimaryButton, SecondaryButton } from '@entur/button'
import { LoadingDots } from '@entur/loader'
import { Modal } from '@entur/modal'
import {
    Heading1,
    Heading2,
    Heading3,
    LeadParagraph,
    Paragraph,
} from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTiles } from 'app/(admin)/components/TileSelector/utils'
import { useSaveDemoBoardInLocalStorage } from 'app/(admin)/hooks/useSaveDemoBoardInLocalStorage'
import { SettingsForm } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/SettingsForm'
import { TileList } from 'app/(admin)/tavler/[id]/rediger/components/TileList'
import { CreateUserButton } from 'app/components/CreateUserButton'
import { DemoPreview } from 'app/demo/components/DemoPreview'
import { publishBoard } from 'app/lag-tavle/actions'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import sheep from 'assets/illustrations/Sheep.png'
import Image from 'next/image'
import { CopyIcon, ExternalIcon } from 'node_modules/@entur/icons/dist'
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
            <SettingsForm board={board} onSubmit={handleSettingsSubmit} />
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
                <div className="flex flex-col gap-4">
                    <Paragraph className="mb-1">
                        Velg hvordan du vil gå videre
                    </Paragraph>
                    <div className="w-full border-t border-strokeNeutral" />
                    <div className="flex flex-row gap-4">
                        <Box>
                            <div className="flex flex-col">
                                <Badge
                                    text="For deg som kun skal lage én tavle"
                                    color="negativeMuted"
                                />
                                <Heading3 as="h3">Få lenke til tavla</Heading3>
                                <Paragraph>
                                    Lenken gjelder kun for denne versjonen av
                                    tavla. Gjør du endringer, endres lenken, og
                                    du må kopiere den på nytt.
                                </Paragraph>
                            </div>
                            <PrimaryButton
                                onClick={handlePublish}
                                width="fluid"
                            >
                                Få lenke til Tavla
                            </PrimaryButton>
                        </Box>
                        <Box>
                            <div className="flex flex-col">
                                <Badge
                                    text="Flere valg og mer fleksibelt"
                                    color="informationMuted"
                                />
                                <Heading3 as="h3">
                                    Opprett bruker og lagre tavla
                                </Heading3>
                                <Paragraph>
                                    Med bruker kan du gjøre endringer uten at
                                    lenken til Tavla endrer seg, slik at tavla
                                    automatisk oppdateres med siste endringer.
                                </Paragraph>
                            </div>
                            <CreateUserButton variant="primary" width="fluid" />
                        </Box>
                    </div>
                </div>
            )
        case 'publishing':
            return <LoadingDots />
        case 'published':
            return (
                <>
                    <Paragraph>
                        Din tavle er nå klar! Kopier lenken og del den med andre
                        eller vis den på en skjerm.
                    </Paragraph>
                    <CopyableText
                        successHeading=""
                        successMessage="Lenken til tavlen ble kopiert!"
                    >
                        {getBoardLinkClient(publishState.boardId)}
                    </CopyableText>
                    <div className="flex flex-row gap-2">
                        <PrimaryButton
                            onClick={() => console.log('Kopier')}
                            width="fluid"
                        >
                            Kopier lenke
                            <CopyIcon />
                        </PrimaryButton>
                        <PrimaryButton
                            onClick={() => console.log('Åpne')}
                            width="fluid"
                        >
                            Åpne tavla
                            <ExternalIcon />
                        </PrimaryButton>
                    </div>
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

function Box({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-1 flex-col justify-between gap-3 rounded-[20px] border border-strokeNeutral bg-tintLight px-6 pb-8 pt-6">
            {children}
        </div>
    )
}

function Badge({
    text,
    color,
}: {
    text: string
    color: 'negativeMuted' | 'informationMuted'
}) {
    return (
        <span
            className={`w-fit rounded-[4px] border border-strokeContrast bg-${color} px-1 py-0.5 text-xs`}
        >
            {text}
        </span>
    )
}

export { CreateBoardLocally }
