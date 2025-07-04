import { TDepartureFragment, TSituationFragment } from 'graphql/index'
import React from 'react'
import { Destination, Name } from './components/Destination'
import { DeparturesContext } from './contexts'
import { TColumn } from 'types/column'
import { isArray } from 'lodash'
import { AimedTime } from './components/Time/AimedTime'
import { ArrivalTime } from './components/Time/ArrivalTime'
import { Platform } from './components/Platform'
import { ExpectedTime } from './components/Time/ExpectedTime'
import { Line } from './components/Line'
import { StopPlaceDeviation } from './components/StopPlaceDeviation'
import Image from 'next/image'
import leafs from 'assets/illustrations/leafs.svg'
import leafsLight from 'assets/illustrations/leafs-light.png'
import { Paragraph } from '@entur/typography'

function Table({
    departures,
    columns,
    situations,
}: {
    departures: TDepartureFragment[]
    columns?: TColumn[]
    situations?: TSituationFragment[]
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
            <StopPlaceDeviation situations={situations} />
            <div className="flex shrink-0">
                <DeparturesContext.Provider value={departures}>
                    {columns.includes('aimedTime') && <AimedTime />}
                    {columns.includes('arrivalTime') && <ArrivalTime />}
                    {columns.includes('line') && <Line />}
                    {columns.includes('destination') && (
                        <Destination deviations />
                    )}
                    {columns.includes('name') && <Name />}
                    {columns.includes('platform') && <Platform />}
                    {columns.includes('time') && <ExpectedTime />}
                </DeparturesContext.Provider>
            </div>
        </div>
    )
}

export { Table }
