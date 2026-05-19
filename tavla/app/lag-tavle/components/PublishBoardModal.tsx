'use client'
import { CopyableText } from '@entur/alert'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { LoadingDots } from '@entur/loader'
import { Heading3, Paragraph } from '@entur/typography'
import { CreateUserButton } from 'app/components/CreateUserButton'
import type { PublishBoardState } from 'app/lag-tavle/components/CreateBoardLocally'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import sheep from 'assets/illustrations/Sheep.png'
import Image from 'next/image'
import { CopyIcon, ExternalIcon } from 'node_modules/@entur/icons/dist'
import { getBoardLinkClient } from 'src/utils/boardLink'

export function PublishModalContent({
    publishState,
    handlePublish,
    resetPublish,
}: {
    publishState: PublishBoardState
    handlePublish: () => void
    resetPublish: () => void
}) {
    const posthog = usePosthogTracking()

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
                                    color="peach"
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
                                    color="sky"
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
                        onClick={() => {
                            posthog.capture('baord_without_user_link_copied')
                            navigator.clipboard.writeText(
                                getBoardLinkClient(publishState.boardId),
                            )
                        }}
                    >
                        {getBoardLinkClient(publishState.boardId)}
                    </CopyableText>
                    <div className="flex flex-row gap-2">
                        <PrimaryButton
                            onClick={() => {
                                posthog.capture(
                                    'baord_without_user_link_copied',
                                )

                                navigator.clipboard.writeText(
                                    getBoardLinkClient(publishState.boardId),
                                )
                            }}
                            width="fluid"
                        >
                            Kopier lenke
                            <CopyIcon />
                        </PrimaryButton>
                        <PrimaryButton
                            onClick={() => {
                                posthog.capture(
                                    'board_without_user_board_opened',
                                )
                                window.open(
                                    getBoardLinkClient(publishState.boardId),
                                    '_blank',
                                )
                            }}
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

const badgeColorClass = {
    peach: 'bg-peach20',
    sky: 'bg-sky10',
} as const

function Badge({ text, color }: { text: string; color: 'peach' | 'sky' }) {
    return (
        <span
            className={`w-fit rounded-[4px] border border-strokeContrast ${badgeColorClass[color]} px-1 py-0.5 text-xs`}
        >
            {text}
        </span>
    )
}
