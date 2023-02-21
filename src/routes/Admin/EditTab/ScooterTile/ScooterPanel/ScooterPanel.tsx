import React, {
    ChangeEvent,
    SyntheticEvent,
    useCallback,
    useMemo,
    useState,
} from 'react'
import { xor } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { useScooterPanelQuery } from 'graphql-generated/mobility-v2'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { ALL_ACTIVE_OPERATOR_IDS } from 'utils/constants'
import { Fieldset, Switch, TextField } from '@entur/form'
import type { VariantType } from '@entur/form'
import { FilterChip } from '@entur/chip'
import classes from './ScooterPanel.module.scss'

function ScooterPanel(): JSX.Element {
    const [settings, setSettings] = useSettings()
    const [enabled, setEnabled] = useState(settings.scooterDistance.enabled)
    const [variant, setVariant] = useState<VariantType>('info')
    const [feedback, setFeedback] = useState<string | undefined>()

    const [, setTimeoutId] = useState<NodeJS.Timeout | undefined>()
    const debounceSetScooterDistance = (distance: number) => {
        const id = setTimeout(() => {
            setSettings({
                scooterDistance: {
                    distance,
                    enabled,
                },
            })
        }, 1000)

        setTimeoutId((prevId) => {
            if (prevId) {
                clearTimeout(prevId)
            }
            return id
        })
    }

    const handleDistanceInput = (e: SyntheticEvent<HTMLInputElement>) => {
        if (e.currentTarget.validity.valid) {
            setVariant('info')
            setFeedback(undefined)

            const value = Number(e.currentTarget.value) || 1
            debounceSetScooterDistance(value)
        } else {
            setVariant('error')
            setFeedback('Must be a number between 1 and 1000')
        }
    }

    const { data } = useScooterPanelQuery({
        fetchPolicy: 'cache-and-network',
    })

    const onToggleOperator = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setSettings({
                hiddenMobilityOperators: xor(settings.hiddenMobilityOperators, [
                    event.target.id,
                ]),
            })
        },
        [settings.hiddenMobilityOperators, setSettings],
    )

    const operators = useMemo(
        () =>
            data?.operators
                ?.filter(isNotNullOrUndefined)
                .filter((operator) => !!ALL_ACTIVE_OPERATOR_IDS[operator.id]) ??
            [],
        [data?.operators],
    )

    return (
        <div className={classes.ScooterPanel}>
            <div className={classes.DistanceWrapper}>
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
                className={classes.NumberInput}
                type="number"
                min={1}
                max={1000}
                onInput={handleDistanceInput}
                defaultValue={
                    settings.scooterDistance.distance || settings.distance
                }
                size="large"
                disableLabelAnimation={true}
                variant={variant}
                feedback={feedback}
                disabled={!enabled}
            />
            <Fieldset>
                <div className={classes.Container}>
                    <legend className={classes.LegendWrapper}>
                        Velg radius for sparkesyker
                    </legend>
                    {operators.map((operator) => (
                        <div key={operator.id} className={classes.Buttons}>
                            <FilterChip
                                id={operator.id}
                                value={operator.id}
                                name={operator.id}
                                checked={
                                    !settings.hiddenMobilityOperators.includes(
                                        operator.id,
                                    )
                                }
                                onChange={onToggleOperator}
                            >
                                {operator.name.translation[0] && (
                                    <span className={classes.Paragraph}>
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
