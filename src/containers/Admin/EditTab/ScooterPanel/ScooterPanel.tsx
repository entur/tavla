import React, { ChangeEvent, useCallback, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { Fieldset } from '@entur/form'
import { FilterChip } from '@entur/chip'
import { Operator } from '@entur/sdk/lib/mobility/types'
import { useSettings } from '../../../../settings/SettingsProvider'
import { ALL_ACTIVE_OPERATOR_IDS } from '../../../../constants'
import { toggleValueInList } from '../../../../utils/array'
import './ScooterPanel.scss'
import ScooterPanelQuery from './ScooterPanelQuery.mobility.graphql'

function ScooterPanel(): JSX.Element {
    const [settings, setSettings] = useSettings()

    const { data } = useQuery<{ operators: Operator[] }>(ScooterPanelQuery, {
        fetchPolicy: 'cache-and-network',
    })

    const { hiddenMobilityOperators = [] } = settings || {}

    const onToggleOperator = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setSettings({
                hiddenMobilityOperators: toggleValueInList(
                    hiddenMobilityOperators,
                    event.target.id,
                ),
            })
        },
        [hiddenMobilityOperators, setSettings],
    )

    const operators = useMemo(
        () =>
            data?.operators.filter(
                (operator) => !!ALL_ACTIVE_OPERATOR_IDS[operator.id],
            ) ?? [],
        [data?.operators],
    )

    return (
        <Fieldset className="scooter-panel">
            <div className="scooter-panel__container">
                {operators.map((operator) => (
                    <div key={operator.id} className="scooter-panel__buttons">
                        <FilterChip
                            id={operator.id}
                            value={operator.id}
                            name={operator.id}
                            checked={
                                !hiddenMobilityOperators.includes(operator.id)
                            }
                            onChange={onToggleOperator}
                        >
                            {operator.name.translation[0] && (
                                <span className="scooter-panel__eds-paragraph">
                                    {operator.name.translation[0].value}
                                </span>
                            )}
                        </FilterChip>
                    </div>
                ))}
            </div>
        </Fieldset>
    )
}

export { ScooterPanel }
