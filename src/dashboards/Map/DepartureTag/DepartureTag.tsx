import React from 'react'
import { format, isToday } from 'date-fns'
import { nb } from 'date-fns/locale'
import { colors } from '@entur/tokens'
import { Heading4 } from '@entur/typography'
import {
    StopPlaceWithDepartures,
    IconColorType,
    LineData,
} from '../../../types'
import { getIcon, getIconColor } from '../../../utils'
import { DepartureIcon } from './DepartureIcon/DepartureIcon'
import './DepartureTag.scss'

function getDepartureDirection(departure: LineData): string[] {
    return departure.route.split(/([\s])/g).slice(1)
}

function getDepartureNumber(departure: LineData): string {
    return departure.route.split(/[\s]/g)[0] || ''
}

const DepartureTag = (props: Props): JSX.Element => (
    <div className="departure-tile">
        <Heading4
            className="departure-tile__stop"
            style={{ color: colors.brand.blue }}
        >
            {props.stopPlace.name}
        </Heading4>
        <div>
            {props.stopPlace.departures.slice(0, 2).map((departure) => (
                <div className="departure-row" key={departure.id}>
                    <DepartureIcon
                        icon={getIcon(
                            departure.type,
                            undefined,
                            departure.subType,
                            colors.brand.white,
                        )}
                        color={getIconColor(
                            departure.type,
                            IconColorType.DEFAULT,
                            departure.subType,
                        )}
                        routeNumber={getDepartureNumber(departure)}
                    />
                    <div className="departure-row__direction">
                        {getDepartureDirection(departure)}
                    </div>
                    <div className="departure-row__departure">
                        {departure.time}
                    </div>
                    {isToday(departure.departureTime) ? null : (
                        <Date date={departure.departureTime} />
                    )}
                </div>
            ))}
        </div>
        <div className="divider"></div>
    </div>
)

function Date({ date }: { date: Date }) {
    const formatedDate = format(date, 'd. MMMM', { locale: nb })

    return <div className="departure-row__date">{`(${formatedDate})`}</div>
}

interface Props {
    stopPlace: StopPlaceWithDepartures
}
export { DepartureTag }
