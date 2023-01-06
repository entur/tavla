import React, { useMemo } from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'
import { Tile } from '../Tile/Tile'
import { TileHeader } from '../TileHeader/TileHeader'
import { useSettings } from '../../settings/SettingsProvider'
import { getIconColorType } from '../../utils/icon'
import { getTranslation } from '../../utils/utils'
import { FormFactor } from '../../../graphql-generated/mobility-v2'
import { useRentalStations } from '../../logic/use-rental-stations/useRentalStations'
import { ErrorTile } from '../ErrorTile/ErrorTile'
import { Loader } from '../Loader/Loader'
import { BikeTileRow } from './BikeTileRow'
import classes from './BikeTile.module.scss'

const BikeTile: React.FC = () => {
    const [settings] = useSettings()
    const iconColor = useMemo(
        () => colors.transport[getIconColorType(settings.theme)].mobility,
        [settings.theme],
    )

    const { rentalStations, loading, error } = useRentalStations([
        FormFactor.Bicycle,
    ])

    if (loading) {
        return (
            <Tile className={classes.BikeTile}>
                <Loader />
            </Tile>
        )
    }

    if (error) {
        return <ErrorTile className={classes.BikeTile} />
    }

    return (
        <Tile className={classes.BikeTile}>
            <TileHeader
                title="Bysykkel"
                icons={<BicycleIcon color={iconColor} />}
            />
            {rentalStations.map((station) => (
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
