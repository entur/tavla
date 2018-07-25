import React from 'react'
import { getIcon } from '../../utils'

const RouteList = ({
    departures, updateHiddenList, getStyle, onCheck,
}) => (
    <table className="route-table">
        <tbody>
            { departures.map(({ route, type }, index) => {
                const isVisible = onCheck(route, 'routes')
                return (
                    <tr style={getStyle(isVisible)} key={index}>
                        <td className="route-icon">{getIcon(type)}</td>
                        <td className="route-title">{route}</td>
                        <td className="route-button">
                            <button className="route-list-button" onClick={() => updateHiddenList(route, 'routes')}>
                                <div aria-visible={isVisible} className="close" />
                            </button>
                        </td>
                    </tr>
                )
            }) }
        </tbody>
    </table>
)

export default RouteList
