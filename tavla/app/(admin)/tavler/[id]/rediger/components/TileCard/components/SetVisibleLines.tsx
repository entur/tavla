import { Heading4 } from '@entur/typography'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { TileContext } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/context'
import { EventProps } from 'app/posthog/events'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import { TTransportMode } from 'src/types/graphql-schema'
import { TransportModeAndLines } from '../TransportModeAndLines'
import { TLineFragment } from '../types'
import { sortLineByPublicCode } from '../utils'

function SetVisibleLines({
    uniqLines,
    transportModes,
    trackingLocation,
}: {
    uniqLines: TLineFragment[]
    transportModes: (TTransportMode | null)[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
}) {
    const tile = useNonNullContext(TileContext)
    const linesByModeSorted = transportModes
        .map((transportMode) => ({
            transportMode,
            lines: uniqLines
                .filter((line) => line.transportMode === transportMode)
                .sort(sortLineByPublicCode),
        }))
        .sort((a, b) => b.lines.length - a.lines.length)

    return (
        <>
            <Heading4>Transportmidler og linjer</Heading4>
            <div className="flex flex-col gap-4 md:flex-row">
                {linesByModeSorted.map(({ transportMode, lines }) => (
                    <TransportModeAndLines
                        key={transportMode}
                        tile={tile}
                        transportMode={transportMode}
                        lines={lines}
                        trackingLocation={trackingLocation}
                    />
                ))}
            </div>
            <HiddenInput id="count" value={uniqLines.length.toString()} />
        </>
    )
}

export { SetVisibleLines }
