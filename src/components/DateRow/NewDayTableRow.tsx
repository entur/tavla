import React from 'react'
import { format, isSameDay } from 'date-fns'
import { nb } from 'date-fns/locale'
import { DataCell, TableRow } from '@entur/table'
import { Heading4 } from '@entur/typography'
import css from './NewDayTableRow.module.scss'

type NewDayTableRowProps = {
    currentDate: Date
    previousDate?: Date
}

const NewDayTableRow: React.FC<NewDayTableRowProps> = ({
    currentDate,
    previousDate,
}) => {
    const isNewDay = previousDate && !isSameDay(previousDate, currentDate)

    if (!isNewDay) {
        return null
    }

    const formatedDate = format(currentDate, 'EEEE d. MMMM', {
        locale: nb,
    })

    return (
        <TableRow className={css.newDayTableRow}>
            <DataCell>
                <Heading4 as="h3">{formatedDate}</Heading4>
            </DataCell>
        </TableRow>
    )
}

export { NewDayTableRow }
