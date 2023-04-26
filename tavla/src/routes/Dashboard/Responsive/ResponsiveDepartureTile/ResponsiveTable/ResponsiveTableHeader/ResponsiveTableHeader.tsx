import React from 'react'
import { useSettings } from 'settings/SettingsProvider'
import classes from './ResponsiveTableHeader.module.scss'

function ResponsiveTableHeader() {
    const [settings] = useSettings()

    return (
        <thead>
            <tr className={classes.TableHeader}>
                <th>Linje</th>
                {!settings.hideTracks && <th>Plattform</th>}
                <th className={classes.HeaderDestination}>Destinasjon</th>
                <th className={classes.HeaderDepartureTime}>Avgang</th>
            </tr>
        </thead>
    )
}

export { ResponsiveTableHeader }
