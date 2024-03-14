import { Paragraph } from '@entur/typography'
import classes from './styles.module.css'
import { WalkIcon } from '@entur/icons'

function TableHeader({ heading }: { heading: string }) {
    return (
        <div className={classes.tableHeaderWrapper}>
            <h1 className={classes.heading}>{heading}</h1>
            <Paragraph className={classes.duration}>
                <WalkIcon color="ffff" className="m-0" />
                5min
            </Paragraph>
        </div>
    )
}

export { TableHeader }
