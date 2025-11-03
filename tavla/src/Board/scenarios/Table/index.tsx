import { Paragraph } from '@entur/typography'
import leafsLight from 'assets/illustrations/leafs-light.png'
import leafs from 'assets/illustrations/leafs.svg'
import { TDepartureFragment, TSituationFragment } from 'graphql/index'
import { isArray } from 'lodash'
import Image from 'next/image'
import { TileColumnDB } from 'types/db-types/boards'
import { TDepartureWithTile } from '../Board/utils'
import { Destination, Name } from './components/Destination'
import { Deviation } from './components/Deviation'
import { Line } from './components/Line'
import { Platform } from './components/Platform'
import { AimedTime } from './components/Time/AimedTime'
import { ArrivalTime } from './components/Time/ArrivalTime'
import { ExpectedTime } from './components/Time/ExpectedTime'
import { DeparturesContext } from './contexts'

function Table({
    departures,
    columns,
    stopPlaceSituations,
    currentVisibleSituationId,
    numberOfVisibleSituations,
}: {
    departures: TDepartureFragment[] | TDepartureWithTile[]
    columns?: TileColumnDB[]
    stopPlaceSituations?: TSituationFragment[]
    currentVisibleSituationId?: string
    numberOfVisibleSituations?: number
}) {
    const theme = document
        .querySelector('[data-theme]')
        ?.getAttribute('data-theme')

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
                    src={theme === 'light' ? leafsLight : leafs}
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
                    <Deviation
                        currentVisibleSituationId={currentVisibleSituationId}
                        stopPlaceSituations={stopPlaceSituations}
                        numberOfShownSituations={numberOfVisibleSituations}
                    />
                    {columns.includes('aimedTime') && <AimedTime />}
                    {columns.includes('arrivalTime') && <ArrivalTime />}
                    {columns.includes('line') && <Line />}
                    {columns.includes('destination') && <Destination />}
                    {columns.includes('name') && <Name />}
                    {columns.includes('platform') && <Platform />}
                    {columns.includes('time') && <ExpectedTime />}
                </DeparturesContext.Provider>
            </div>
        </div>
    )
}

export { Table }
