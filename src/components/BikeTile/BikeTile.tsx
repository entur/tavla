import React, { useMemo } from 'react'
import { Tile } from 'components/Tile/Tile'
import { getIconColorType } from 'utils/icon'
import { useRentalStations } from 'logic/use-rental-stations/useRentalStations'
import { useSettings } from 'settings/SettingsProvider'
import { FormFactor } from 'graphql-generated/mobility-v2'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'
import { TileHeader } from '../TileHeader/TileHeader'
import { ErrorTile } from '../ErrorTile/ErrorTile'
import { Loader } from '../Loader/Loader'
import { BikeTileRow } from './BikeTileRow'
import classes from './BikeTile.module.scss'
import classNames from 'classnames'

const BikeTile: React.FC<{ className?: string }> = ({ className }) => {
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
            <Tile className={classNames(classes.BikeTile, className)}>
                <Loader />
            </Tile>
        )
    }

    if (error) {
        return <ErrorTile className={classNames(classes.BikeTile, className)} />
    }

    return (
        <Tile className={classNames(classes.BikeTile, className)}>
            <TileHeader
                title="Bysykkel"
                icons={<BicycleIcon color={iconColor} />}
            />
            {rentalStations.map((station) => (
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
