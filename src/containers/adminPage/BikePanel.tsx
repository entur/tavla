import React, { useCallback } from 'react'
import { Checkbox } from '@entur/component-library'
import { BikeRentalStation } from '@entur/sdk'

import { toggleValueInList } from '../../utils'
import { useSettingsContext } from '../../settings'

import './styles.scss'

function BikePanel(props: Props): JSX.Element {
    const [settings, { setHiddenStations }] = useSettingsContext()
    const { hiddenStations } = settings

    const { stations } = props

    const onChooseAllPressed = useCallback(() => {
        if (hiddenStations.length > 0) {
            setHiddenStations([])
        } else {
            setHiddenStations(stations.map(({ id }) => id))
        }
    }, [hiddenStations.length, setHiddenStations, stations])

    const onToggleStation = useCallback((event) => {
        const stationId = event.target.id
        const newDisabledList = toggleValueInList(hiddenStations, stationId)
        setHiddenStations(newDisabledList)
    }, [hiddenStations, setHiddenStations])

    if (!stations.length) {
        return <div className="selection-panel"/>
    }

    return (
        <div className="city-bike-panel">
            <div className="stop-place-header">
                <div className="selection-panel-title">Bysykler</div>
                <div className="checkbox-container-check-all">
                    <Checkbox
                        id="check-all-stop-places-bike"
                        name="check-all-stop-places-bike"
                        label="Velg alle"
                        className="entur-radio-checkbox--squared"
                        onChange={onChooseAllPressed}
                        checked={!hiddenStations.length}
                    />
                </div>
            </div>
            {
                stations.map(({ name, id }, index) => {
                    return (
                        <div key={index}>
                            <div className="selection-row" key={index}>
                                <div className="checkbox-container">
                                    <Checkbox
                                        key={id}
                                        id={id}
                                        name={name}
                                        checked={!hiddenStations.includes(id)}
                                        onChange={onToggleStation}
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
    )
}

interface Props {
    stations: Array<BikeRentalStation>,
}

export default BikePanel
