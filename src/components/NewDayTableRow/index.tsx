import React from 'react'
import { format, isSameDay } from 'date-fns'
import { nb } from 'date-fns/locale'
import { DataCell, TableRow } from '@entur/table'
import { Heading4 } from '@entur/typography'
import classes from './NewDayTableRow.module.scss'

function NewDayTableRow({
    currentDate,
    previousDate,
}: {
    currentDate: Date
    previousDate?: Date
}) {
    const isNewDay = previousDate && !isSameDay(previousDate, currentDate)

    if (!isNewDay) {
        return null
    }

    const formatedDate = format(currentDate, 'EEEE d. MMMM', {
        locale: nb,
    })

    return (
        <TableRow className={classes.NewDayTableRow}>
            <DataCell>
                <Heading4 as="h3">{formatedDate}</Heading4>
            </DataCell>
        </TableRow>
    )
}

export { NewDayTableRow }
