import React, { useCallback } from 'react'
import { Checkbox, Fieldset } from '@entur/form'
import { ScooterOperator, Scooter } from '@entur/sdk'

import { toggleValueInList } from '../../../../utils'
import { useSettingsContext } from '../../../../settings'

import './styles.scss'
import { Paragraph } from '@entur/typography'

function ScooterPanel(props: Props): JSX.Element {
    const [settings, { setHiddenOperators }] = useSettingsContext()
    const { hiddenOperators = [] } = settings || {}

    const { scooters } = props
    const allOperators = ['voi', 'tier', 'lime', 'zvipp']
    const onChooseAllPressed = useCallback(() => {
        if (hiddenOperators.length > 0) {
            setHiddenOperators([])
        } else {
            setHiddenOperators(allOperators)
        }
    }, [hiddenOperators.length, setHiddenOperators, allOperators])

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
            {allOperators.map((operator) => (
                <Checkbox
                    key={operator}
                    id={operator}
                    label={operator}
                    name={operator}
                    checked={!hiddenOperators.includes(operator)}
                    onChange={onToggleOperator}
                >
                    <span className="bike-panel__eds-paragraph">
                        {operator}
                    </span>
                </Checkbox>
            ))}
        </Fieldset>
    )
}

interface Props {
    scooters: Scooter[]
}

export default ScooterPanel
