import { Paragraph } from '@entur/typography'
import { CustomName } from 'Board/hooks/useTileData'
import { Destination, Name } from 'Board/scenarios/Table/components/Destination'
import { Platform } from 'Board/scenarios/Table/components/Platform'
import { AimedTime } from 'Board/scenarios/Table/components/Time/AimedTime'
import { ArrivalTime } from 'Board/scenarios/Table/components/Time/ArrivalTime'
import { ExpectedTime } from 'Board/scenarios/Table/components/Time/ExpectedTime'
import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import leafsLight from 'assets/illustrations/leafs-light.png'
import leafs from 'assets/illustrations/leafs.svg'
import { TDepartureFragment, TSituationFragment } from 'graphql/index'
import { isArray } from 'lodash'
import Image from 'next/image'
import { TileColumnDB } from 'types/db-types/boards'
import { Deviation_Legacy } from './Deviation_Legacy'
import { Line_Legacy } from './Line_Legacy'

function Table_Legacy({
    departures,
    columns,
    stopPlaceSituations,
    currentVisibleSituationId,
    numberOfVisibleSituations,
    customNames,
    theme,
    palette,
}: {
    departures: TDepartureFragment[]
    columns?: TileColumnDB[]
    stopPlaceSituations?: TSituationFragment[]
    currentVisibleSituationId?: string
    numberOfVisibleSituations?: number
    customNames?: CustomName[]
    theme?: string | null
    palette?: string | null
}) {
    const currentTheme =
        theme ??
        (typeof document !== 'undefined'
            ? document.querySelector('[data-theme]')?.getAttribute('data-theme')
            : null)

    if (!columns || !isArray(columns))
        return (
            <div className="flex shrink-0">
                Du har ikke lagt til noen kolonner ennå
            </div>
        )

    if (departures.length === 0)
        return (
            <div className="flex h-full w-full flex-col items-center justify-center pb-4 text-center text-em-sm">
                <Image
                    src={currentTheme === 'light' ? leafsLight : leafs}
                    alt=""
                    className="h-[6em] w-[6em] sm:max-h-[10em] sm:max-w-[10em] lg:h-[15em] lg:w-[15em]"
                />
                <Paragraph className="!text-primary sm:pb-8">
                    Ingen avganger de neste 24 timene.
                </Paragraph>
            </div>
        )
    return (
        <div className="flex flex-col">
            <div className="flex shrink-0">
                <DeparturesContext.Provider value={departures}>
                    <Deviation_Legacy
                        currentVisibleSituationId={currentVisibleSituationId}
                        stopPlaceSituations={stopPlaceSituations}
                        numberOfShownSituations={numberOfVisibleSituations}
                    />
                    {columns.includes('aimedTime') && <AimedTime />}
                    {columns.includes('arrivalTime') && <ArrivalTime />}
                    {columns.includes('line') && (
                        <Line_Legacy palette={palette} />
                    )}
                    {columns.includes('destination') && <Destination />}
                    {columns.includes('name') && (
                        <Name customNames={customNames} />
                    )}
                    {columns.includes('platform') && <Platform />}
                    {columns.includes('time') && <ExpectedTime />}
                </DeparturesContext.Provider>
            </div>
        </div>
    )
}

export { Table_Legacy }
