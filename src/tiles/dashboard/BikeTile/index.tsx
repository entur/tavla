import React, { useMemo } from 'react'
import { getIconColorType } from 'utils/icon'
import { useRentalStations } from 'hooks/use-rental-stations/useRentalStations'
import { useSettings } from 'settings/SettingsProvider'
import { FormFactor } from 'graphql-generated/mobility-v2'
import { Tile } from 'components/Tile'
import { TileHeader } from 'components/TileHeader'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'
import { Loader } from '@entur/loader'
import { ErrorTile } from '../ErrorTile'
import classes from './BikeTile.module.scss'
import { BikeTileRow } from './components/BikeTileRow'

function BikeTile() {
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
                <BikeTileRow
                    key={station.id}
                    station={station}
                    iconColor={iconColor}
                    hideWalkInfo={settings.hideWalkInfo}
                />
            ))}
        </Tile>
    )
}

export { BikeTile }
