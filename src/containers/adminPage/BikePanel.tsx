import React, { useState } from 'react'
import { Checkbox } from '@entur/component-library'
import { Coordinates, BikeRentalStation } from '@entur/sdk'

import BikePanelSearch from './searchPanels/BikePanelSearch'
import './styles.scss'

function BikePanel(props: Props): JSX.Element {
    const [checked, setChecked] = useState(false)

    const {
        onCheck, updateHiddenList, stations,
        position, handleAddNewStations,
    } = props

    const onChange = (): void => {
        props.updateHiddenListForAll(!checked, 'stations')
        setChecked(!checked)
    }

    if (!stations.length) {
        return <div className="selection-panel"/>
    }

    return (
        <div className="selection-panel">
            <div>
                <div className="search-stop-places">
                    <BikePanelSearch position={position} handleAddNewStations={handleAddNewStations}/>
                </div>
                <div className="city-bike-panel">
                    <div className="stop-place-header">
                        <div className="selection-panel-title">Bysykler</div>
                        <div className="checkbox-container-check-all">
                            <Checkbox
                                id="check-all-stop-places-bike"
                                name="check-all-stop-places-bike"
                                label="Velg alle"
                                className="entur-radio-checkbox--squared"
                                onChange={onChange}
                                checked={checked}
                            />
                        </div>
                    </div>
                    {
                        stations.map(({
                            name, id,
                        }, index) => {
                            const isChecked = !onCheck(id, 'stations')
                            return (
                                <div key={index}>
                                    <div className="selection-row" key={index}>
                                        <div className="checkbox-container">
                                            <Checkbox
                                                key={id}
                                                id={id}
                                                checked={isChecked}
                                                onChange={(): void => {
                                                    updateHiddenList(id, 'stations')
                                                    if (checked) { setChecked(!checked) }
                                                }}
                                                className="entur-radio-checkbox--round entur-radio-checkbox--margin"
                                                variant="midnight"
                                            />
                                        </div>
                                        <div className="selection-data-wrapper">
                                            <div className="selection-data-container">
                                                <div className="city-bike-name">{name}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="city-bike-row-bottom-border" />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

interface Props {
    onCheck: (id: string, type: 'stations') => boolean,
    updateHiddenList: (id: string, type: 'stations') => void,
    updateHiddenListForAll: (checked: boolean, type: 'stations') => void,
    stations: Array<BikeRentalStation>,
    position: Coordinates,
    handleAddNewStations: (stations: Array<BikeRentalStation>) => void,
}

export default BikePanel
