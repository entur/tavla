import React, { useCallback } from 'react'
import { Checkbox, JustCheckbox } from '@entur/component-library'
import { BikeRentalStation } from '@entur/sdk'

import { toggleValueInList } from '../../../utils'
import { useSettingsContext } from '../../../settings'

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
        <div className="bike-panel">
            <div className="bike-panel__header">
                <h2>Bysykler</h2>
                <Checkbox
                    id="check-all-stop-places-bike"
                    name="check-all-stop-places-bike"
                    label="Velg alle"
                    onChange={onChooseAllPressed}
                    checked={!hiddenStations.length}
                    variant="midnight"
                />
            </div>
            {
                stations.map(({ name, id }, index) => {
                    return (
                        <div key={index} className="bike-panel__row">
                            <label htmlFor={id}>
                                <JustCheckbox
                                    key={id}
                                    id={id}
                                    label={name}
                                    name={name}
                                    checked={!hiddenStations.includes(id)}
                                    onChange={onToggleStation}
                                    variant="midnight"
                                />
                                <span>{ name }</span>
                            </label>
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
