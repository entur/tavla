import React, { useCallback } from 'react'
import { Checkbox, Fieldset } from '@entur/form'

import { ALL_OPERATORS } from '../../../../constants'
import { toggleValueInList } from '../../../../utils'
import { useSettingsContext } from '../../../../settings'

import './styles.scss'

function ScooterPanel(): JSX.Element {
    const [settings, { setHiddenOperators }] = useSettingsContext()
    const { hiddenOperators = [] } = settings || {}

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
