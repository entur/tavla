import React, { useMemo } from 'react'
import { format, isToday } from 'date-fns'
import { nb } from 'date-fns/locale'
import { colors } from '@entur/tokens'
import { Heading4, Paragraph } from '@entur/typography'
import { IconColorType } from '../../../types'
import { getIconColor } from '../../../utils/icon'
import { TransportModeIcon } from '../../../components/TransportModeIcon/TransportModeIcon'
import { DepartureIcon } from '../DepartureIcon/DepartureIcon'
import { useStopPlaceWithEstimatedCalls } from '../../../logic/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import {
    Departure,
    filterHidden,
    toDeparture,
} from '../../../logic/use-stop-place-with-estimated-calls/departure'
import { useSettings } from '../../../settings/SettingsProvider'
import { Loader } from '../../../components/Loader/Loader'
import classes from './DepartureTag.module.scss'

function getDepartureDirection(departure: Departure): string[] {
    return departure.route.split(/([\s])/g).slice(1)
}

function getDepartureNumber(departure: Departure): string {
    return departure.route.split(/[\s]/g)[0] || ''
}

interface Props {
    stopPlaceId: string
}

const DepartureTag: React.FC<Props> = ({ stopPlaceId }): JSX.Element => {
    const [settings] = useSettings()
    const { stopPlaceWithEstimatedCalls, loading } =
        useStopPlaceWithEstimatedCalls({ stopPlaceId })

    const departures = useMemo(
        () =>
            stopPlaceWithEstimatedCalls?.estimatedCalls
                .map(toDeparture)
                .filter(filterHidden(stopPlaceId, settings)) ?? [],
        [stopPlaceWithEstimatedCalls?.estimatedCalls, stopPlaceId, settings],
    )

    if (loading) {
        return (
            <div className={classes.DepartureTag}>
                <Loader />
            </div>
        )
    }

    if (!stopPlaceWithEstimatedCalls) {
        return (
            <div className={classes.DepartureTag}>
                <Heading4 className={classes.ErrorText}>
                    Her var det tomt!
                </Heading4>
                <Paragraph className={classes.ErrorText}>
                    Noe gikk galt da vi prøvde å hente informasjon om
                    stoppestedet.
                </Paragraph>
            </div>
        )
    }

    return (
        <div className={classes.DepartureTag}>
            <Heading4 className={classes.Stop}>
                {stopPlaceWithEstimatedCalls.name}
            </Heading4>
            <div>
                {departures.slice(0, 2).map((departure) => (
                    <div className={classes.DepartureRow} key={departure.id}>
                        <DepartureIcon
                            icon={
                                <TransportModeIcon
                                    transportMode={departure.transportMode}
                                    transportSubmode={
                                        departure.transportSubmode
                                    }
                                    color={colors.brand.white}
                                />
                            }
                            color={getIconColor(
                                departure.transportMode,
                                IconColorType.DEFAULT,
                                departure.transportSubmode,
                            )}
                            routeNumber={getDepartureNumber(departure)}
                        />
                        <div className={classes.Direction}>
                            {getDepartureDirection(departure)}
                        </div>
                        <div className={classes.Departure}>
                            {departure.time}
                        </div>
                        {!isToday(departure.departureTime) && (
                            <Date date={departure.departureTime} />
                        )}
                    </div>
                ))}
            </div>
            <div className={classes.Divider} />
        </div>
    )
}

function Date({ date }: { date: Date }) {
    const formatedDate = format(date, 'd. MMMM', { locale: nb })

    return <div className={classes.Date}>{`(${formatedDate})`}</div>
}

export { DepartureTag }
