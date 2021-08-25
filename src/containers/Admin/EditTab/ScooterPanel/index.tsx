import React, { useCallback } from 'react'
import { Fieldset } from '@entur/form'
import { FilterChip } from '@entur/chip'
import { Label } from '@entur/typography'

import { toggleValueInList } from '../../../../utils'
import { useSettingsContext } from '../../../../settings'
import { useOperators } from '../../../../logic'
import { ALL_ACTIVE_OPERATOR_IDS } from '../../../../constants'

import './styles.scss'

function ScooterPanel(): JSX.Element {
    const [settings, setSettings] = useSettingsContext()
    const operators = useOperators(Object.values(ALL_ACTIVE_OPERATOR_IDS))
    const { hiddenMobilityOperators = [] } = settings || {}

    const onToggleOperator = useCallback(
        (event) => {
            const OperatorId = event.target.id
            setSettings({
                hiddenMobilityOperators: toggleValueInList(
                    hiddenMobilityOperators,
                    OperatorId,
                ),
            })
        },
        [hiddenMobilityOperators, setSettings],
    )

    return (
        <Fieldset className="scooter-panel">
            <div className="scooter-panel__container">
                <Label>
                    Sparkesykkel krever visningstype som støtter kart.
                </Label>
                <br />
                {operators.map((operator, index) => (
                    <div
                        key={operator + 'btn' + index.toString()}
                        className="scooter-panel__buttons"
                    >
                        <FilterChip
                            key={operator.id}
                            id={operator.id}
                            value={operator.id}
                            name={operator.id}
                            checked={
                                !hiddenMobilityOperators.includes(operator.id)
                            }
                            onChange={onToggleOperator}
                        >
                            <span className="scooter-panel__eds-paragraph">
                                {operator.name.translation[0].value}
                            </span>
                        </FilterChip>
                    </div>
                ))}
            </div>
        </Fieldset>
    )
}

export default ScooterPanel
