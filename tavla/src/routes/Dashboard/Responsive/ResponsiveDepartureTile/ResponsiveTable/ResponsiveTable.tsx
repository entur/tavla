import React from 'react'
import { Departure } from 'src/types'
import { ResponsiveTableHeader } from './ResponsiveTableHeader/ResponsiveTableHeader'
import { ResponsiveTableRow } from './ResponsiveTableRow/ResponsiveTableRow'
import classes from './ResponsiveTable.module.scss'

function ResponsiveTable({ departures }: { departures: Departure[] }) {
    return (
        <table className={classes.ResponsiveTable}>
            <ResponsiveTableHeader />
            <tbody>
                {departures.map((departure) => (
                    <ResponsiveTableRow
                        key={departure.id}
                        departure={departure}
                    />
                ))}
            </tbody>
        </table>
    )
}

export { ResponsiveTable }
