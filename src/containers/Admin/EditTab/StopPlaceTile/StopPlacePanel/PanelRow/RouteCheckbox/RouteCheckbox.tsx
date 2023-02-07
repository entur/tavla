import React, { useCallback } from 'react'
import { xor } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { Checkbox } from '@entur/form'
import classes from './RouteCheckbox.module.scss'

interface Props {
    route: string
    stopPlaceId: string
}

const RouteCheckbox: React.FC<Props> = ({ route, stopPlaceId }) => {
    const [settings, setSettings] = useSettings()

    const onToggleRoute = useCallback(() => {
        const newHiddenRoutes = {
            ...settings.hiddenRoutes,
            [stopPlaceId]: xor(settings.hiddenRoutes[stopPlaceId] || [], [
                route,
            ]),
        }
        setSettings({
            hiddenRoutes: newHiddenRoutes,
        })
    }, [settings.hiddenRoutes, setSettings, stopPlaceId, route])

    return (
        <Checkbox
            className={classes.Route}
            name={route}
            onChange={onToggleRoute}
            checked={!settings.hiddenRoutes[stopPlaceId]?.includes(route)}
        >
            {route}
        </Checkbox>
    )
}

export { RouteCheckbox }
