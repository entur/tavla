import React from 'react'
import { useSettings } from 'settings/SettingsProvider'
import classes from './ResponsiveTableHeader.module.scss'

function ResponsiveTableHeader() {
    const [settings] = useSettings()

    return (
        <thead>
            <tr className={classes.TableHeader}>
                <th className={classes.HeaderDepartureTime}>Avgang</th>
                <th>Linje</th>
                <th className={classes.HeaderDestination}>Destinasjon</th>
                {!settings.hideTracks && (
                    <th className={classes.platform}>Plattform</th>
                )}
            </tr>
        </thead>
    )
}

export { ResponsiveTableHeader }
