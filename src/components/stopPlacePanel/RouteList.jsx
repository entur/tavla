import React from 'react'
import { getIcon } from '../../utils'

const RouteList = ({ departures, updateHiddenList, style }) => (
    <tbody>
        { departures.map(({ route, type }, index) => (
            <tr style={style(route, 'routes')} key={index}>
                <td>{getIcon(type)}</td>
                <td>{route}</td>
                <td>
                    <button onClick={() => updateHiddenList(route, 'routes')}>X</button>
                </td>
            </tr>)) }
    </tbody>
)

export default RouteList
