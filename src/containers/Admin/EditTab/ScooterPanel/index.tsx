import React, { useCallback } from 'react'
import { Fieldset } from '@entur/form'
import { FilterChip } from '@entur/chip'
import { Label } from '@entur/typography'

import { ALL_OPERATORS } from '../../../../constants'
import { toggleValueInList } from '../../../../utils'
import { useSettingsContext } from '../../../../settings'

import './styles.scss'

function ScooterPanel(): JSX.Element {
    const [settings, { setSettings }] = useSettingsContext()
    const { hiddenOperators = [] } = settings || {}

    const onToggleOperator = useCallback(
        (event) => {
            const OperatorId = event.target.id
            setSettings({
                hiddenOperators: toggleValueInList(hiddenOperators, OperatorId),
            })
        },
        [hiddenOperators, setSettings],
    )

    return (
        <Fieldset className="scooter-panel">
            <div className="scooter-panel__container">
                <Label>
                    Sparkesykkel krever visningstype som støtter kart.
                </Label>
                <br />
                {ALL_OPERATORS.map((operator) => (
                    <div
                        key={operator + 'btn'}
                        className="scooter-panel__buttons"
                    >
                        <FilterChip
                            key={operator}
                            id={operator}
                            value={operator}
                            name={operator}
                            checked={!hiddenOperators.includes(operator)}
                            onChange={onToggleOperator}
                        >
                            <span className="scooter-panel__eds-paragraph">
                                {operator.charAt(0).toUpperCase() +
                                    operator.slice(1)}
                            </span>
                        </FilterChip>
                    </div>
                ))}
            </div>
        </Fieldset>
    )
}

export default ScooterPanel
