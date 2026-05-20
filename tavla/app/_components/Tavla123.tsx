import { MapPinIcon, NewIcon, ShareIcon } from '@entur/icons'
import { Heading1, Heading3, Paragraph } from '@entur/typography'

export function Tavla123() {
    return (
        <div className="py-16 mx-6 text-left lg:text-center">
            <Heading1 as="h2" margin="none">
                Tavle på 1, 2, 3
            </Heading1>
            <Paragraph margin="bottom">
                Så enkelt er det å lage en tavle
            </Paragraph>

            <div className="mt-12 grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-32 mx-auto">
                <div className="flex flex-col items-start text-left rounded-2xl pt-6">
                    <div className="bg-coral p-3 rounded-2xl text-white">
                        <MapPinIcon width={36} height={36} />
                    </div>
                    <Heading3>Legg til stoppesteder</Heading3>
                    <Paragraph className="text-()">
                        Skriv inn en adresse, et sted eller et stoppested og
                        legg til stoppesteder. Du kan velge så mange du vil.
                    </Paragraph>
                </div>

                <div className="flex flex-col items-start text-left rounded-2xl pt-6">
                    <div className="bg-coral p-3 rounded-2xl text-white">
                        <NewIcon width={36} height={36} />
                    </div>
                    <Heading3>Tilpass visningen</Heading3>
                    <Paragraph>
                        Tilpass visningen etter dine behov. Velg fargemodus,
                        tekststørrelse, legg til logo og filtrer på linjer.
                    </Paragraph>
                </div>

                <div className="flex flex-col items-start text-left rounded-2xl pt-6">
                    <div className="bg-coral p-3 rounded-2xl text-white">
                        <ShareIcon width={36} height={36} />
                    </div>
                    <Heading3>Åpne og del</Heading3>
                    <Paragraph>
                        Åpne lenken til din tavle på hvilken som helst enhet med
                        nettleser, og du er ferdig. Oppdater når som helst, fra
                        hvor som helst.
                    </Paragraph>
                </div>
            </div>
        </div>
    )
}
