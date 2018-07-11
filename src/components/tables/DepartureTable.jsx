import React from 'react'
import { getIcon } from '../../utils'

const DepartureTable = ({ lineData }) => {
    return (
        lineData.map(({
            departures, name, id,
        }) => {
            const {
                time, type, code, destination,
            } = departures
            console.log(departures)
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
                            <tr className="row">
                                <td className="time">{departures.time}</td>
                                <td className="type">{getIcon(type)}</td>
                                <td className="route">
                                    {code} {destination}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        })
    )
}

export default DepartureTable
