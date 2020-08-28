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

    const { operators } = props

    console.log(operators)
    const onChooseAllPressed = useCallback(() => {
        if (hiddenOperators.length > 0 || null) {
            setHiddenOperators([])
        } else {
            setHiddenOperators(operators.map((sctr) => sctr.operator))
        }
    }, [hiddenOperators.length, setHiddenOperators, operators])

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

    if (!Object.entries(operators || {}).length) {
        return (
            <Fieldset className="bike-panel">
                <Paragraph>Det er ingen sykler i nærheten.</Paragraph>
            </Fieldset>
        )
    }

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
            {Object.keys(operators || {}).map((operator) => (
                <Checkbox
                    key={operator.toString()}
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
    operators: Record<ScooterOperator, Scooter[]> | null
}

export default ScooterPanel
