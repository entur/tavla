import React, { useCallback } from 'react'
import { xor } from 'lodash'
import { TravelSwitch } from '@entur/form'
import { TransportMode } from '../../../../../../../graphql-generated/journey-planner-v3'
import { isTransport } from '../../../../../../utils/typeguards'
import { useSettings } from '../../../../../../settings/SettingsProvider'

interface Props {
    stopPlaceId: string
    mode: TransportMode
    numberOfModes: number
}

const TransportModeSwitch: React.FC<Props> = ({
    stopPlaceId,
    mode,
    numberOfModes,
}) => {
    const [settings, setSettings] = useSettings()

    const onToggleMode = useCallback((): void => {
        const newHiddenModes = {
            ...settings.hiddenStopModes,
            [stopPlaceId]: xor(settings.hiddenStopModes[stopPlaceId] || [], [
                mode,
            ]),
        }

        const allModesUnchecked =
            numberOfModes === newHiddenModes[stopPlaceId]?.length

        if (allModesUnchecked) {
            setSettings({
                hiddenStops: [...settings.hiddenStops, stopPlaceId],
                hiddenStopModes: newHiddenModes,
            })
            return
        }

        setSettings({
            hiddenStops: settings.hiddenStops.filter(
                (id) => id !== stopPlaceId,
            ),
            hiddenStopModes: newHiddenModes,
        })
    }, [
        settings.hiddenStopModes,
        settings.hiddenStops,
        stopPlaceId,
        numberOfModes,
        setSettings,
        mode,
    ])

    const isCoach = mode === 'coach'

    if (!isTransport(mode) && !isCoach) {
        return <></>
    }

    return (
        <TravelSwitch
            transport={isCoach ? 'bus' : mode}
            size="large"
            onChange={onToggleMode}
            checked={!settings.hiddenStopModes[stopPlaceId]?.includes(mode)}
        >
            {isCoach ? 'Coach' : undefined}
        </TravelSwitch>
    )
}

export { TransportModeSwitch }
