import React, { useMemo } from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'
import { Tile } from '../Tile/Tile'
import { TileHeader } from '../TileHeader/TileHeader'
import { useSettings } from '../../settings/SettingsProvider'
import { getIconColorType } from '../../utils/icon'
import { StationFragment } from '../../../graphql-generated/mobility-v2'
import { getTranslation } from '../../utils/utils'
import { BikeTileRow } from './BikeTileRow'
import classes from './BikeTile.module.scss'

interface BikeTileProps {
    stations: StationFragment[]
}

const BikeTile: React.FC<BikeTileProps> = ({ stations }) => {
    const [settings] = useSettings()

    const iconColor = useMemo(
        () => colors.transport[getIconColorType(settings.theme)].mobility,
        [settings.theme],
    )

    return (
        <Tile className={classes.BikeTile}>
            <TileHeader
                title="Bysykkel"
                icons={<BicycleIcon color={iconColor} />}
            />
            {stations.map((station) => (
                // eslint-disable-next-line react/jsx-key
                <div>
                    <p tabIndex={0} className={classes.uuText}>
                        {' '}
                        På {getTranslation(station.name)} er det{' '}
                        {station.numBikesAvailable} sykler ledig og{' '}
                        {station.numDocksAvailable} låser ledig.
                    </p>
                    <BikeTileRow
                        key={station.id}
                        station={station}
                        iconColor={iconColor}
                    />
                </div>
            ))}
        </Tile>
    )
}

export { BikeTile }
