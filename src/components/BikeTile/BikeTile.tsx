import React, { useMemo } from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'
import { Tile } from '../Tile/Tile'
import { TileHeader } from '../TileHeader/TileHeader'
import { useSettings } from '../../settings/SettingsProvider'
import { getIconColorType } from '../../utils/icon'
import { StationFragment } from '../../../graphql-generated/mobility-v2'
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
                <BikeTileRow
                    key={station.id}
                    station={station}
                    iconColor={iconColor}
                />
            ))}
        </Tile>
    )
}

export { BikeTile }
