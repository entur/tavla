/* eslint-disable @typescript-eslint/no-unused-vars */
import { TDepartureFragment, TSituationFragment } from 'graphql/index'
import React from 'react'
import { Destination } from './components/Destination'
import { DeparturesContext } from './contexts'
import { TColumn } from 'types/column'
import { isArray } from 'lodash'
import { RealTime } from './components/RealTime'
import { AimedTime } from './components/Time/AimedTime'
import { ArrivalTime } from './components/Time/ArrivalTime'
import { Platform } from './components/Platform'
import { ExpectedTime } from './components/Time/ExpectedTime'
import { Line } from './components/Line'
import { StopPlaceDeviation } from './components/StopPlaceDeviation'
import Image from 'next/image'
import leafs from 'assets/illustrations/Leafs.png'

function Table({
    departures,
    columns,
    situations,
}: {
    departures: TDepartureFragment[]
    columns?: TColumn[]
    situations?: TSituationFragment[]
}) {
    if (!columns || !isArray(columns))
        return (
            <div className="flex shrink-0">
                Du har ikke lagt til noen kolonner enda
            </div>
        )

    if (departures.length === 0)
        return (
            <div className="flex flex-col items-center justify-center text-center h-full w-full text-em-sm">
                <Image src={leafs} alt="" height={500} width={500} />
                Ingen avganger de neste 24 timene.
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
                    {columns.includes('platform') && <Platform />}
                    {columns.includes('time') && <ExpectedTime />}
                    {columns.includes('realtime') && <RealTime />}
                </DeparturesContext.Provider>
            </div>
        </div>
    )
}

export { Table }
