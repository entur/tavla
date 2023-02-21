import React from 'react'
import classes from './ResponsiveTableHeader.module.scss'

const ResponsiveTableHeader: React.FC = () => (
    <thead>
        <tr className={classes.TableHeader}>
            <th>Linje</th>
            <th className={classes.HeaderDestination}>Destinasjon</th>
            <th className={classes.HeaderDepartureTime}>Avgang</th>
        </tr>
    </thead>
)

export { ResponsiveTableHeader }
