import { useCallback } from 'react'
import { TQuayTile } from '@/types/tile'
import { Table } from '@/components/Table'
import { quayQuery } from '@/graphql/queries/quay'
import { usePoll } from '@/hooks/usePoll'
import classes from './styles.module.css'

export function QuayTile({
    placeId,
    columns,
    whitelistedLines,
    whitelistedTransportModes,
}: TQuayTile) {
    const quayCallbackQuery = useCallback(
        () =>
            quayQuery({
                quayId: placeId,
                whitelistedLines,
                whitelistedTransportModes,
            }),
        [placeId, whitelistedLines, whitelistedTransportModes],
    )

    const data = usePoll(quayCallbackQuery)

    if (!data) {
        return <div className="tile">Loading data</div>
    }

    if (!data.quay) {
        return <div className="tile">Data not found</div>
    }

    return (
        <div className={classes.quayTile}>
            <div className={classes.heading}>
                <h3>{data.quay.name}</h3>
                <h4>
                    {data.quay.publicCode} {data.quay.description}
                </h4>
            </div>
            <Table columns={columns} departures={data.quay.estimatedCalls} />
        </div>
    )
}
