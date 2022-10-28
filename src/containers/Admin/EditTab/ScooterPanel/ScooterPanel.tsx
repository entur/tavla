import React, {
    ChangeEvent,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { useQuery } from '@apollo/client'
import { Fieldset, Switch, TextField } from '@entur/form'
import type { VariantType } from '@entur/form'
import { FilterChip } from '@entur/chip'
import { Operator } from '@entur/sdk/lib/mobility/types'
import { useSettings } from '../../../../settings/SettingsProvider'
import {
    ALL_ACTIVE_OPERATOR_IDS,
    DEFAULT_DISTANCE,
} from '../../../../constants'
import { toggleValueInList } from '../../../../utils/array'
import { useDebounce } from '../../../../hooks/useDebounce'
import './ScooterPanel.scss'
import ScooterPanelQuery from './ScooterPanelQuery.mobility.graphql'

function ScooterPanel(): JSX.Element {
    const [settings, setSettings] = useSettings()
    const { scooterDistance } = settings || {}

    const [distance, setDistance] = useState(
        settings?.scooterDistance?.distance ||
            settings?.distance ||
            DEFAULT_DISTANCE,
    )

    const debouncedScooterDistance = useDebounce(distance, 800)

    const [variant, setVariant] = useState<VariantType>('info')
    const [feedback, setFeedback] = useState<string | undefined>()

    const handleDistanceInput = (e: SyntheticEvent<HTMLInputElement>) => {
        if (e.currentTarget.validity.valid) {
            setVariant('info')
            setFeedback(undefined)

            const value = Number(e.currentTarget.value) || 1
            setDistance(value)
        } else {
            setVariant('error')
            setFeedback('Must be a number between 1 and 1000')
        }
    }

    const [enabled, setEnabled] = useState(Boolean(scooterDistance?.enabled))

    useEffect(() => {
        if (
            settings?.scooterDistance?.distance !== debouncedScooterDistance ||
            settings?.scooterDistance?.enabled !== enabled
        ) {
            setSettings({
                scooterDistance: {
                    distance: debouncedScooterDistance,
                    enabled,
                },
            })
        }
    }, [debouncedScooterDistance, enabled, settings, setSettings])

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
        <div className="scooter-panel">
            <div className="scooter-panel-distance-wrapper">
                Velg avstand for visning av sparkesykler:
                <Switch
                    onChange={() => {
                        setEnabled((prev) => !prev)
                    }}
                    checked={enabled}
                    size="medium"
                />
            </div>
            <TextField
                label="Vis sparkesykler innenfor"
                append="Meter"
                className="scooter-panel-number-input"
                type="number"
                min={1}
                max={1000}
                onInput={handleDistanceInput}
                size="large"
                disableLabelAnimation={true}
                variant={variant}
                feedback={feedback}
                disabled={!enabled}
            />
            <Fieldset className="scooter-panel-fieldset">
                <div className="scooter-panel__container">
                    {operators.map((operator) => (
                        <div
                            key={operator.id}
                            className="scooter-panel__buttons"
                        >
                            <FilterChip
                                id={operator.id}
                                value={operator.id}
                                name={operator.id}
                                checked={
                                    !hiddenMobilityOperators.includes(
                                        operator.id,
                                    )
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
        </div>
    )
}

export { ScooterPanel }
