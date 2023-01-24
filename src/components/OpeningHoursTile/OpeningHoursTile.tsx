import classNames from 'classnames'
import React from 'react'
import { Tile } from '../Tile/Tile'
import { TileHeader } from '../TileHeader/TileHeader'
import classes from './OpeningHoursTile.module.scss'

interface OpeningHours {
    OpeningTime: string
    ClosingTime: string
    Weekday: number
}

function numberToday(num: number) {
    return [
        'Søndag',
        'Mandag',
        'Tirdag',
        'Onsdag',
        'Torsdag',
        'Fredag',
        'Lørdag',
    ][num]
}

const mockHours: OpeningHours[] = [
    { Weekday: 1, OpeningTime: '09:00', ClosingTime: '18:00' },
    { Weekday: 2, OpeningTime: '09:00', ClosingTime: '18:00' },
    { Weekday: 3, OpeningTime: '09:00', ClosingTime: '18:00' },
    { Weekday: 4, OpeningTime: '09:00', ClosingTime: '16:00' },
]

const OpeningHoursTile: React.FC = () => {
    console.log('Hei')
    return (
        <Tile className={classes.OpeningHoursTile}>
            <TileHeader title="Åpningstider" />
            <div className={classes.OpeningHours}>
                {mockHours.map((openingHour, i) => (
                    <div key={i} className={classes.Hei}>
                        <span
                            className={classNames({
                                [classes.CurrentHours]:
                                    new Date().getDay() === openingHour.Weekday,
                            })}
                        >
                            {openingHour.OpeningTime} -{' '}
                            {openingHour.ClosingTime}
                        </span>{' '}
                        <span>{numberToday(openingHour.Weekday)}</span>
                    </div>
                ))}
            </div>
        </Tile>
    )
}

export { OpeningHoursTile }
