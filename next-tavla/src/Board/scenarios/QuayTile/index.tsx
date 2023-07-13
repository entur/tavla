import { TQuayTile } from 'types/tile'
import { Table } from '../../scenarios/Table'
import classes from './styles.module.css'
import { useQuery } from 'graphql/utils'
import { GetQuayQuery } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'

export function QuayTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
}: TQuayTile) {
    const { data } = useQuery(
        GetQuayQuery,
        {
            quayId: placeId,
            whitelistedLines,
            whitelistedTransportModes,
        },
        { poll: true },
    )

    if (!data) {
        return <Tile>Loading data</Tile>
    }

    if (!data.quay) {
        return <Tile>Data not found</Tile>
    }
    const transportModes = data.quay.lines
        .map((line) => line.transportMode)
        .filter((transporMode, pos, ar) => ar.indexOf(transporMode) === pos)
    console.log(data.quay.publicCode)
    console.log(data.quay.description)
    return (
        <Tile className={classes.quayTile}>
            <TableHeader
                heading={
                    data.quay.publicCode
                        ? data.quay.name + ' ' + data.quay.publicCode
                        : data.quay.name
                }
                transportModes={transportModes}
            />
            <Table departures={data.quay.estimatedCalls} />
        </Tile>
    )
}
