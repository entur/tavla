import React from 'react'
import { getIcon } from '../../utils'

const BikeTable = ({ stationData }) => {
    return (<tbody>
        {
            stationData.map(({
                name, bikesAvailable, spacesAvailable, id,
            }) => (
                <tr className="row" key={id}>
                    <td className="time">{bikesAvailable}/{bikesAvailable+spacesAvailable}</td>
                    <td className="type">{getIcon('bike')}</td>
                    <td className="route">{name}</td>
                </tr>
            ))
        }
    </tbody>)
}

export default BikeTable
