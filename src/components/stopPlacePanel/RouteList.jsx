import React from 'react'
import { getIcon } from '../../utils'

const RouteList = ({
    departures, updateHiddenList, getStyle, onCheck,
}) => (
    <table className="admin-route-table">
        <tbody>
            { departures.map(({ route, type }, index) => {
                const isVisible = !onCheck(route, 'routes')
                return (
                    <tr style={getStyle(isVisible)} key={index}>
                        <td className="admin-route-icon">{getIcon(type)}</td>
                        <td className="admin-route-title">{route}</td>
                        <td className="admin-route-button-container">
                            <button className="admin-route-button" onClick={() => updateHiddenList(route, 'routes')}>
                                <div value={isVisible} className="close" />
                            </button>
                        </td>
                    </tr>
                )
            }) }
        </tbody>
    </table>
)

export default RouteList
