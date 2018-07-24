import React from 'react'
import { getIcon } from '../../utils'
import RouteList from './RouteList'

const StopPlacePanel = ({ stops, updateHiddenList, style }) => (
    <div className="stops">
        <table className="table">
            <thead>
                <tr>
                    <th>Fjern busstopp</th>
                </tr>
            </thead>
            {
                stops.map(({
                    name, id, transportMode, departures,
                }) => [
                    <tbody>
                        <tr style={style(id, 'stops')} key={id}>
                            <td>
                                <button className="stop-place-checkbox" onClick={() => updateHiddenList(id, 'stops')}>X</button>
                            </td>
                            <td>{getIcon(transportMode)}</td>
                            <td>{name}</td>
                        </tr>
                    </tbody>,
                    <RouteList departures={departures} updateHiddenList={updateHiddenList} style={style}/>,
                ])
            }
        </table>
    </div>
)

export default StopPlacePanel
