import { BusIcon } from '@entur/icons'
import React from 'react'

import { LineData } from '../../../../types'
import { filterMap } from '../../../../utils'

import './styles.scss'

interface Props {
    departures: LineData[]
    platform?: string
    type?: string
}

function BusTile({ departures }: Props): JSX.Element | null {
    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '2.5rem' }}>Neste buss</p>
            </div>
            <div
                className="available-vehicles-box"
                style={{
                    width: '90%',
                    display: 'inline-block',
                    height: '23%',
                    marginBottom: '10%',
                    padding: '1rem',
                }}
            >
                {filterMap(departures, (departure) => {
                    const routeNumber = departure.route.split(' ')[0]
                    const routeDestination = departure.route
                        .split(' ')
                        .slice(1)
                        .join(' ')

                    return (
                        <div key={departure.id} className="row-box">
                            <div className="red-box">
                                <BusIcon
                                    color="white"
                                    style={{
                                        height: '4rem',
                                        width: '4rem',
                                        marginLeft: '1rem',
                                    }}
                                />
                                <p className="lineNumber">{routeNumber}</p>
                            </div>
                            <p className="stopPlace">{routeDestination}</p>
                            <p className="time">{departure.time}</p>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default BusTile
