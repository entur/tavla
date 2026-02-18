import { Heading4 } from '@entur/typography'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { TileContext } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/context'
import { EventProps } from 'app/posthog/events'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import { TQuay, TTransportMode } from 'src/types/graphql-schema'
import { PlatformAndLines } from '../PlatformAndLines'
import { TLineFragment } from '../types'
import { transportModeNames } from '../utils'

function SetVisibleLines({
    quays,
    allLines,
    trackingLocation,
}: {
    quays: TQuay[]
    allLines: TLineFragment[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
}) {
    const tile = useNonNullContext(TileContext)

    // Group Quays by Transport Mode
    const quaysByTransportMode = Object.values(
        quays.reduce(
            (acc, quay) => {
                let mode: TTransportMode = 'unknown'
                if (quay.lines.length > 0) {
                    mode =
                        (quay.lines[0]?.transportMode as TTransportMode) ||
                        'unknown'
                } else if (
                    quay.stopPlace?.transportMode &&
                    quay.stopPlace.transportMode.length > 0
                ) {
                    mode =
                        (quay.stopPlace.transportMode[0] as TTransportMode) ||
                        'unknown'
                }

                if (!acc[mode]) {
                    acc[mode] = {
                        mode: mode as TTransportMode,
                        label: transportModeNames(mode) || 'Ukjent',
                        quays: [],
                    }
                }

                acc[mode]?.quays.push(quay)
                return acc
            },
            {} as Record<
                string,
                { mode: TTransportMode; label: string; quays: TQuay[] }
            >,
        ),
    ).sort((a, b) => a.label.localeCompare(b.label))

    return (
        <>
            <Heading4>Plattformer og linjer</Heading4>
            <div className="flex flex-col gap-8 md:flex-row">
                {quaysByTransportMode.map(({ mode, quays }) => (
                    <div key={mode} className="flex flex-col gap-4">
                        {quays
                            .sort((a, b) =>
                                (a.publicCode || '').localeCompare(
                                    b.publicCode || '',
                                    undefined,
                                    { numeric: true },
                                ),
                            )
                            .map((quay) => {
                                const title =
                                    quay.name && quay.publicCode
                                        ? `${mode === 'metro' || mode === 'rail' ? 'Spor' : 'Plattform'} ${quay.publicCode}`
                                        : quay.name || 'Ukjent'

                                return (
                                    <PlatformAndLines
                                        key={quay.id}
                                        tile={tile}
                                        groupKey={quay.publicCode || quay.id}
                                        title={title}
                                        lines={quay.lines}
                                        trackingLocation={trackingLocation}
                                        transportMode={mode as TTransportMode}
                                    />
                                )
                            })}
                    </div>
                ))}
            </div>
            <HiddenInput id="count" value={allLines.length.toString()} />
        </>
    )
}

export { SetVisibleLines }
