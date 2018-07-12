import React from 'react'
import { getIcon } from '../../utils'

const DepartureTable = ({ lineData }) => {
    return (
        lineData.filter(({ departures }) => departures.length > 0).map(({
            departures, name, id,
        }) => {
            return (
                <div className="stop-place" key={id}>
                    <h3>{name}</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="time">Avgang</th>
                                <th className="type">Linje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departures.map(({
                                time, type, code, destination,
                            }, index) => {
                                return (
                                    <tr className="row" key={index}>
                                        <td className="time">{time}</td>
                                        <td className="type">{getIcon(type)}</td>
                                        <td className="route">
                                            {code} {destination}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )
        })
    )
}

export default DepartureTable
