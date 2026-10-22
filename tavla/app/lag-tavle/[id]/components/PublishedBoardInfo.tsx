'use client'
import { CopyableText } from '@entur/alert'
import { PrimaryButton } from '@entur/button'
import { CopyIcon, ExternalIcon } from '@entur/icons'
import { Heading2, Paragraph } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'

export function PublishedBoardInfo({ boardLink }: { boardLink: string }) {
    const { capture } = usePosthogTracking()

    function copyLink() {
        capture('board_copied', { location: 'board_without_user' })
        navigator.clipboard.writeText(boardLink)
    }

    return (
        <div className="flex flex-col items-center gap-4 pt-16 text-center">
            <Heading2 as="h1" margin="none">
                Tavla er publisert!
            </Heading2>
            <Paragraph margin="none" className="max-w-prose">
                Kopier lenken og del den med andre, eller vis den på en skjerm.
                Siden du ikke er logget inn, kan du ikke lenger redigere denne
                tavla.
            </Paragraph>
            <CopyableText
                className="max-w-prose"
                successHeading=""
                successMessage="Lenken til tavla ble kopiert!"
                onClick={copyLink}
            >
                {boardLink}
            </CopyableText>
            <div className="flex flex-row gap-2">
                <PrimaryButton onClick={copyLink}>
                    Kopier lenke
                    <CopyIcon />
                </PrimaryButton>
                <PrimaryButton
                    onClick={() => {
                        capture('board_opened', {
                            location: 'board_without_user',
                        })
                        window.open(boardLink, '_blank')
                    }}
                >
                    Åpne tavla
                    <ExternalIcon />
                </PrimaryButton>
            </div>
        </div>
    )
}
