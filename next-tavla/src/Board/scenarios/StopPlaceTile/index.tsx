'use client'
import { TStopPlaceTile } from 'types/tile'
import { Table } from '../../scenarios/Table'
import classes from './styles.module.css'
import { fetchQuery, useQuery } from 'graphql/utils'
import { StopPlaceQuery, TStopPlaceQuery } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'
import { TileLoader } from 'Board/components/TileLoader'
import { useEffect, useState } from 'react'

export function StopPlaceTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    columns,
}: TStopPlaceTile) {
    // const { data } = useQuery(
    //     StopPlaceQuery,
    //     { stopPlaceId: placeId, whitelistedTransportModes, whitelistedLines },
    //     { poll: true },
    // )
    const [data, setData] = useState<TStopPlaceQuery>()

    useEffect(() => {
        fetchQuery(StopPlaceQuery, {
            stopPlaceId: placeId,
            whitelistedLines,
            whitelistedTransportModes,
        }).then((data) => setData(data))
    }, [setData])

    if (!data) {
        return (
            <Tile>
                <TileLoader />
                {data}
            </Tile>
        )
    }

    if (!data.stopPlace) {
        return <Tile>Data not found</Tile>
    }

    return (
        <Tile className={classes.stopPlaceTile}>
            MED USEEFFECT
            <TableHeader heading={data.stopPlace.name} />
            <Table
                departures={data.stopPlace.estimatedCalls}
                situations={data.stopPlace.situations}
                columns={columns}
            />
        </Tile>
    )
}
