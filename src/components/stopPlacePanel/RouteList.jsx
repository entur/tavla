import React from 'react'
import { getIcon } from '../../utils'

const RouteList = ({ departures, updateHiddenList, getStyle }) => (
    <table>
        <tbody>
            { departures.map(({ route, type }, index) => (
                <tr style={getStyle(route, 'routes')} key={index}>
                    <td>{getIcon(type)}</td>
                    <td>{route}</td>
                    <td>
                        <button onClick={() => updateHiddenList(route, 'routes')}>X</button>
                    </td>
                </tr>)) }
        </tbody>
    </table>
)

export default RouteList
