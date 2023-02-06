import React from 'react'
import { BikeTile } from '../../components/BikeTile/BikeTile'
import { WeatherTile } from '../../components/WeatherTile/WeatherTile'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { useStopPlaceIds } from '../../logic/use-stop-place-ids/useStopPlaceIds'
import { useSettings } from '../../settings/SettingsProvider'
import { BusStopTile } from '../BusStop/components/BusStopTile/BusStopTile'
import classes from './NewBusStop.module.scss'


const NewBusStop = ({ stopPlaceId }: Props): JSX.Element => {
    const [settings, setSettings] = useSettings()

    const { stopPlaceIds } = useStopPlaceIds()

    return (
        <DashboardWrapper className="">
            <div className={classes.Wrapper}>
                <div className={classes.LeftTile}>
                    {stopPlaceIds.map((stopPlaceId) => (
                        <BusStopTile
                            stopPlaceId={stopPlaceId}
                            deviationUnder={true}
                            key={stopPlaceId}
                        />
                    ))}
                </div>
                <div className={classes.RightPriceTile}>
                    <WeatherTile
                        className={classes.NewWeatherTile}
                        hideExtraData={true}
                    />
                    <BikeTile className={classes.BikeTile}></BikeTile>
                </div>
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    stopPlaceId?: string
}

export { NewBusStop }
