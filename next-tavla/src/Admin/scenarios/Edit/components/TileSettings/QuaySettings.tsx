import { GetQuayQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { fieldsNotNull } from 'utils/typeguards'
import { TQuayTile } from 'types/tile'
import classes from './styles.module.css'
import { Heading3 } from '@entur/typography'
import { DeleteTile } from '../DeleteTile'
import { Preview } from '../Preview'
import { ToggleColumns } from '../ToggleColumns'
import { SelectLines } from '../SelectLines'

function QuaySettings({ tile }: { tile: TQuayTile }) {
    const lines =
        useQuery(GetQuayQuery, {
            quayId: tile.placeId,
        }).data?.quay?.lines.filter(fieldsNotNull) ?? []

    const departures = useQuery(GetQuayQuery, {
        quayId: tile.placeId,
        whitelistedLines: tile.whitelistedLines,
        whitelistedTransportModes: tile.whitelistedTransportModes,
        numberOfDepartures: 5,
    }).data?.quay?.estimatedCalls

    return (
        <div className={classes.tileSettingsWrapper}>
            <div className="flexRow alignCenter g-3">
                <DeleteTile uuid={tile.uuid} />
                <Heading3 className="m-0">{tile.name}</Heading3>
            </div>
            <Preview tile={tile} departures={departures} />
            <ToggleColumns tile={tile} />
            <SelectLines tile={tile} lines={lines} />
        </div>
    )
}

export { QuaySettings }
