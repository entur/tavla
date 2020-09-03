import React, { useCallback, useState } from 'react'
import { Checkbox, Fieldset } from '@entur/form'
import { ALL_OPERATORS, DEFAULT_ZOOM } from '../../../../constants'
import ReactMapGL, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { toggleValueInList } from '../../../../utils'
import { useSettingsContext } from '../../../../settings'

import './styles.scss'
import { Slider } from '../../../../components'

function ScooterPanel(): JSX.Element {
    const [settings, { setHiddenOperators }] = useSettingsContext()
    const { hiddenOperators = [] } = settings || {}
    const [viewport, setViewPort] = useState({
        latitude: settings?.coordinates?.latitude,
        longitude: settings?.coordinates?.longitude,
        width: 'auto',
        height: '40vh',
        zoom: settings?.zoom ? settings?.zoom : DEFAULT_ZOOM,
    })

    const onChooseAllPressed = useCallback(() => {
        if (hiddenOperators.length > 0) {
            setHiddenOperators([])
        } else {
            setHiddenOperators(ALL_OPERATORS)
        }
    }, [hiddenOperators.length, setHiddenOperators])

    const onToggleOperator = useCallback(
        (event) => {
            const OperatorId = event.target.id
            const newDisabledList = toggleValueInList(
                hiddenOperators,
                OperatorId,
            )
            setHiddenOperators(newDisabledList)
        },
        [hiddenOperators, setHiddenOperators],
    )

    return (
        <Fieldset className="bike-panel">
            <Checkbox
                id="check-all-stop-places-bike"
                name="check-all-stop-places-bike"
                label="Velg alle"
                onChange={onChooseAllPressed}
                checked={!hiddenOperators.length}
            >
                Velg alle
            </Checkbox>
            {ALL_OPERATORS.map((operator) => (
                <Checkbox
                    key={operator}
                    id={operator}
                    label={operator}
                    name={operator}
                    checked={!hiddenOperators.includes(operator)}
                    onChange={onToggleOperator}
                >
                    <span className="bike-panel__eds-paragraph">
                        {operator.charAt(0).toUpperCase() + operator.slice(1)}
                    </span>
                </Checkbox>
            ))}
        </Fieldset>
    )
}

export default ScooterPanel
