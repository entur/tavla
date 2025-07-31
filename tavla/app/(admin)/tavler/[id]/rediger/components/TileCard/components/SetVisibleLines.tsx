import { Heading4 } from '@entur/typography'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TTransportMode } from 'types/graphql-schema'
import { TTile } from 'types/tile'
import { TransportModeAndLines } from '../TransportModeAndLines'
import { TLineFragment } from '../types'
import { sortLineByPublicCode } from '../utils'

function SetVisibleLines({
    tile,
    uniqLines,
    transportModes,
}: {
    tile: TTile
    uniqLines: TLineFragment[]
    transportModes: (TTransportMode | null)[]
}) {
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
                    />
                ))}
            </div>
            <HiddenInput id="count" value={uniqLines.length.toString()} />
        </>
    )
}

export { SetVisibleLines }
